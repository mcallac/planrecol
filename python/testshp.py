#!/usr/bin/python
# -*- coding: utf-8 -*- coding: utf8


from datetime import datetime
from time import localtime, strftime, time
import json, sys, os


"""--------------------------------------------------------------
---------------------------CLASSES-----------------------------
--------------------------------------------------------------"""
class TestShape:
    def __init__(self,nom, descriptionTestProjection, descriptionTestCalque, descriptionTestChamps):
        self.nom=nom
        self.descriptionTestProjection=descriptionTestProjection
        self.descriptionTestCalque=descriptionTestCalque
        self.descriptionTestChamps=descriptionTestChamps
        self.Projection = []
        self.StructureCalques = []
        self.GeomInvalides = []


class Projection:
    def __init__(self, projAttendue, projUtilise, projRes, commentaire):
        self.projAttendue = projAttendue
        self.projUtilise = projUtilise
        self.projRes = projRes
        self.commentaire = commentaire

class StructureCalques:
    def __init__(self, rubrique):
        self.rubrique = rubrique
        self.CalqueRubrique= []

class CalqueRubrique:
    def __init__(self, calque, contenu, present, calqueRes, nbEltsTot, commentaire):
        self.calque = calque
        self.contenu = contenu
        self.present = present
        self.calqueRes = calqueRes
        self.nbEltsTot = nbEltsTot
        self.commentaire = commentaire
        self.Champs = []

class Champs:
    def __init__(self, nom, present, description, champRes, nbEltsRens, commentaire):
        self.nom = nom
        self.present = present
        self.description = description
        self.champRes = champRes
        self.nbEltsRens = nbEltsRens
        self.commentaire = commentaire
        self.geomErreurs = []

class GeomInvalides:
    def __init__(self, calque):
        self.calque=calque
        self.CalqueGeomInvalides=[]
    def __get__(self):
        return self.calque

class CalqueGeomInvalides:
    def __init__(self, geom):
        self.geom=geom
        self.Erreurs = []

class GeomErreurs:
    def __init__(self, geom):
        self.geom=geom



"""--------------------------------------------------------------
---------------------------FONCTIONS-----------------------------
--------------------------------------------------------------"""

def serialiseur_json(obj):

    # Si c'est de type TestShape.
    if isinstance(obj, TestShape):
        return {"__class__": "TestShape",
                "nom": obj.nom,
                "descriptionTestProjection": obj.descriptionTestProjection,
                "descriptionTestCalque": obj.descriptionTestCalque,
                "descriptionTestChamps": obj.descriptionTestChamps,
                "Projection": obj.Projection,
                "StructureCalques":obj.StructureCalques,
                "GeomInvalides":obj.GeomInvalides}

    # Si c'est une projection.
    if isinstance(obj, Projection):
        return {"__class__": "Projection",
                "projAttendue": obj.projAttendue,
                "projUtilise": obj.projUtilise,
                "result": obj.projRes,
                "commentaire": obj.commentaire}

    # Si c'est une StructureCalques.
    if isinstance(obj, StructureCalques):
        return {"__class__": "StructureCalques",
                "rubrique": obj.rubrique,
                "calques": obj.CalqueRubrique}

    # Si c'est une rubrique de CalqueRubrique.
    if isinstance(obj, CalqueRubrique):
        return {"__class__": "CalqueRubrique",
                "calque": obj.calque,
                "contenu": obj.contenu,
                "present": obj.present,
                "result": obj.calqueRes,
                "nbEltsTot": obj.nbEltsTot,
                "commentaire": obj.commentaire,
                "champs":obj.Champs}

    # Si c'est une rubrique de Champs.
    if isinstance(obj, Champs):
        return {"__class__": "Champs",
                "nom": obj.nom,
                "present": obj.present,
                "description": obj.description,
                "result": obj.champRes,
                "nbEltsRens": obj.nbEltsRens,
                "commentaire": obj.commentaire,
                "geomErreurs": obj.geomErreurs}


    # Si c'est une rubrique de GeomInvalides.
    if isinstance(obj, GeomInvalides):
        return {"__class__": "GeomInvalides",
                "calque":obj.calque,
                "CalqueGeomInvalides":obj.CalqueGeomInvalides}

    # Si c'est une rubrique de CalqueGeomInvalides.
    if isinstance(obj, CalqueGeomInvalides):
        return {"__class__": "CalqueGeomInvalides",
                "geom":obj.geom,
                "Erreurs":obj.Erreurs}

# Si c'est une rubrique de GeomErreurs.
    if isinstance(obj, GeomErreurs):
        return {"__class__": "GeomErreurs",
                "geom":obj.geom}


    # Sinon le type de l'objet est inconnu, on lance une exception.
    #raise TypeError(repr(obj) + " n'est pas sérialisable !")
    print repr(obj) + " n'est pas sérialisable !"
#    sys.exit(1)

"""----------------------------------------
       Définition des Dictionaires
                  et 
         des fonctions aassociées
----------------------------------------"""

def write(logfile, message, tag, color="black"):
    print message.encode('utf-8')
    if tag:
        message = ' '.join(['<' + tag + ' style="color:'+color+';" >', message, '</' + tag + '>'])
    logfile.write(message.encode('utf-8') + "</br>")

def testField(pDataLayer, pRequeteCount, pRequeteNull, pCalque, pField):
    pDataLayer.SetAttributeFilter(pRequeteCount)
    nb=pDataLayer.GetFeatureCount()
    pDataLayer.SetAttributeFilter(pRequeteNull)
    geomErreurs=[]

    for feature in pDataLayer:
        mesPrec=""
        #geom=feature.GetGeometryRef().ExportToWkb()
        geom=feature.GetGeometryRef().ExportToWkt()
        if (pCalque,geom) in PropGeomInvalide.keys(): #Si une géométrie existe déja dans le dictionnaire on récupère les messages. Puis on ajoute le nouveau message d'erreur avant de modifier le dictionnaire
            mesPrec=PropGeomInvalide[pCalque,geom]
        if mesPrec<>"":
            mesPrec+="|" #Le caractère "|" sert de séparateur
        mesPrec+="{0} non renseigné".format(pField) 
        PropGeomInvalide[pCalque,geom]=mesPrec
        geomErreurs.append(geom)

    return (nb,geomErreurs)


def writeTxt(pTexte):
    monFichier = open("D:/Developpement/python/testplanrecol/message.txt","a")
    monFichier.write(pTexte)
    monFichier.close()


def testShapePoint():
    print "Début du test Point"
    #Boucle sur les tests configurés dans le json
    json_rapport=TestShape(u"""Plan {0}""".format(fichiershape),"toto","tata","titi")
    for test in config["tests"]:
        #CONTROLE DE LA PROJECTION
        if test["type"] == "proj":
            #Test de la projection
            json_rapport.descriptionTestProjection=test["description"]
            spatialRef = dataLayer.GetSpatialRef()  
            if (spatialRef):
                srstype=spatialRef.GetAttrValue("PROJCS",0) #retourne le nom de la projection    
                json_rapport.Projection.append(Projection(test["scr"],srstype,"ok",""))
            else:
                json_rapport.Projection.append(Projection(test["scr"],"","ok_nb","Aucune projection n'a été définie."))
        #CONTROLE DES CALQUES
        elif test["type"] == "requery_layer":
            json_rapport.descriptionTestCalque=test["description"]
            i=0 #incrément de la rubrique
            for layer in test["layers"]:
                j=0 #incrément du calque dans la rubrique
                json_rapport.StructureCalques.append(StructureCalques(layer["rubrique"]))
                for rubrique in layer["layers rubrique"]:
                    refChamps[rubrique["calque"]]=i,j
                    dataLayer.SetAttributeFilter("Layer = '{0}'".format(rubrique["calque"]))
                    nbEltsTot=dataLayer.GetFeatureCount()
                    if nbEltsTot>0 :
                        json_rapport.StructureCalques[i].CalqueRubrique.append(CalqueRubrique(rubrique["calque"],rubrique["contenu"],"oui","ok",nbEltsTot,""))
                    else:
                        if rubrique["obligatoire"]=="oui":
                            json_rapport.StructureCalques[i].CalqueRubrique.append(CalqueRubrique(rubrique["calque"],rubrique["contenu"],"non","ko_b",nbEltsTot,"La couche obligatoire {0} est manquante ".format(rubrique["calque"])))
                        else:
                            json_rapport.StructureCalques[i].CalqueRubrique.append(CalqueRubrique(rubrique["calque"],rubrique["contenu"],"non","ko_nb",nbEltsTot,"La couche facultative {0} est manquante ".format(rubrique["calque"])))
                    j+=1
                i+=1
        #CONTROLE DES CHAMPS
        elif test["type"] == "requery_fields":
            json_rapport.descriptionTestChamps=test["description"]
            for calque in test["fields"]:
                for field in calque["fields layer"]:
                    i,j=refChamps[calque["calque"]] #i contient l'index de la rubrique et j l'index du calque dans l'objet json_rapport.StructureCalques
                    if json_rapport.StructureCalques[i].CalqueRubrique[j].present=="oui":
                        if field["field"].lower() in fields_shape:
                            #Le champs est présent dans le calque
                            dataLayer.SetAttributeFilter("Layer = '{0}'".format(calque["calque"]))
                            reqCount=""
                            reqNull=""
                            #On doit comptabiliser le nombre d'objets qui ont une valeur de renseignée, le filtre doit se faire en fonction du type de donnée
                            if fields_types[field["field"]] in fields_type_text:
                                reqCount="Layer = '{0}' and {1} is not Null and {1} <> ''".format(calque["calque"],field["field"])
                                reqNull="Layer = '{0}' and ({1} is Null or {1} = '')".format(calque["calque"],field["field"])
                            elif fields_types[field["field"]] in fields_type_numeric:
                                reqCount="Layer = '{0}' and {1} is not Null and {1} <> 0".format(calque["calque"],field["field"])
                                reqNull="Layer = '{0}' and ({1} is Null or {1} = 0)".format(calque["calque"],field["field"])
                            else: 
                                json_rapport.StructureCalques[i].CalqueRubrique[j].Champs.append(Champs(field["field"], "oui", field["description"],"ko_b", 0,0,"ERREUR: Controle du champs {0} : Impossible de déterminer le type de données".format(field["field"])))
                            
                            if reqCount <> "" :
                                nbEltsRens,lGeomErr=testField(dataLayer,reqCount,reqNull,calque["calque"],field["field"])
                                if not lGeomErr: #Pas de Geometrie en erreur : donc tous les élements sont renseignés
                                    json_rapport.StructureCalques[i].CalqueRubrique[j].Champs.append(Champs(field["field"], "oui", field["description"],"ok",nbEltsRens,""))
                                else:
                                    json_rapport.StructureCalques[i].CalqueRubrique[j].Champs.append(Champs(field["field"], "oui", field["description"],"ko_b",nbEltsRens,"Le champ n'est pas totalement rempli"))
                                """
                                La fonction testField retourne le tuple suivant :  
                                    - le nb d'éléments bien renseignés par champs par calque : nbEltsRens
                                    - un tableau contenant la géométrie des éléments qui ne sont pas renseignés correctement : lGeomErr
                                """
                                
                                index_champs=len(json_rapport.StructureCalques[i].CalqueRubrique[j].Champs)-1 #permet de se positionner sur le dernier élément "champs" qui vient d'être copié dans la liste
                                json_rapport.StructureCalques[i].CalqueRubrique[j].Champs[index_champs].geomErreurs=lGeomErr[:]
                        else:
                            #Le champs n'est pas présent dans le calque
                            json_rapport.StructureCalques[i].CalqueRubrique[j].Champs.append(Champs(field["field"], "non", field["description"],"ko_b",0,"Le champs est absent du calque"))


    """-----------------------------------------------------------------------------------------
    On parcourt le dictionnaire PropGeomInvalide : cle = tuple (geometrie,clé) et valeur=erreurs
    Alimentation de la classe GeomInvalides organisée par calque
    Tester la présence du calque dans la classe : calqul de l'index dans la liste : indexCalque
    - s'il existe on ajoute la géométrie dans l'instance du calque
    - sinon on crée un nouveau calque et on ajoute la géométrie dans ce calque
    -----------------------------------------------------------------------------------------"""
    for cle, valeur in PropGeomInvalide.items():
        nomCalque, geometrie=cle
        indexCalque=-1
        for icalque in json_rapport.GeomInvalides:
            if nomCalque==icalque.calque:
                indexCalque=json_rapport.GeomInvalides.index(icalque)
        if indexCalque==-1:
            json_rapport.GeomInvalides.append(GeomInvalides(nomCalque))
            indexCalque=len(json_rapport.GeomInvalides)-1

        json_rapport.GeomInvalides[indexCalque].CalqueGeomInvalides.append(CalqueGeomInvalides(geometrie))
        json_rapport.GeomInvalides[indexCalque].CalqueGeomInvalides[len(json_rapport.GeomInvalides[indexCalque].CalqueGeomInvalides)-1].Erreurs=valeur.split("|")


    #Écriture du json contenant le rapport
    with open(workspace + "/rapport.json", 'w') as f:
        json.dump(json_rapport, f, indent=4, default=serialiseur_json)

def testShapePolyligne():
    print "Début du test Polyligne"



"""----------------------------------------
---------------Corps du script-------------
----------------------------------------"""

dicTests={"Ligne" : testShapePolyligne,
          "Point" : testShapePoint
}
"""---Dictionnaires----"""
refChamps={} #contient la liste des champs du calque et renvoie son index. Cela permet de retrouver l'index en fonction du nom
fields_types = {} #Contient le type de champs
PropGeomInvalide = {} #Contient : [geometrie] et [Liste des erreurs associées à la géométrie]

"""---Listes----"""
fields_shape =[] #Liste des champs du shape
fields_type_text=[]
fields_type_numeric=[]
geometrieInvalides = [] #Liste contenant la liste des géométries invalides ainsi que la liste des erreurs

fields_type_text.append("string")
fields_type_text.append("text")
fields_type_text.append("character")

fields_type_numeric.append("integer")
fields_type_numeric.append("long")
fields_type_numeric.append("real")
fields_type_numeric.append("double")
fields_type_numeric.append("numeric")

try:
    from osgeo import ogr,osr    
except:
    print 'ERROR: Impossible de trouver les modules GDAL/OGR'
    sys.exit(1)


if (len(sys.argv) > 4):
    workspace = sys.argv[1]
    configuration = sys.argv[2]    
    fichiershape = sys.argv[3]
    typecontrole = sys.argv[4]
else:
    print u"""<p>Ce script utilise 4 paramètres :
        <p>- 1 pour le dossier à analyser.
        <p>- 2 pour le fichier json de test à utiliser.
        <p>- 3 pour le nom du fichier shape à analyser.
        <p>- 4 pour le type de contrôle (L->Polyligne ou P->Point).
        """.encode('utf-8')
    sys.exit(1)





start = time() 
config = {}
json_rapport = {}

try:
    with open(configuration) as json_data:
        config = json.load(json_data) 

except:
    print 'ERREUR: impossible de lire le fichier de configuration json {0} (fichier manquant ou erreur de syntaxe dans le fichier json'.format(configuration)
    sys.exit(1)


log_file = workspace + "/rapport.html"


try:
    log = open(log_file,"w")
except:
    print 'ERREUR: Impossible d ouvrir le fichier de rapport {0}'.format(log_file)
    sys.exit(1)


""" Contrôles communs aux 2 couches """
dataSource=ogr.Open(workspace + "/" + fichiershape)
dataLayer=dataSource.GetLayer(0)

layerDefinition = dataLayer.GetLayerDefn()
layerName = dataLayer.GetName()
featureCount = dataLayer.GetFeatureCount()

""" On renseigne le nom des champs dans un tableau ainsi que le type de données """
for i in range(layerDefinition.GetFieldCount()):
    nom_champs = layerDefinition.GetFieldDefn(i).GetName()
    type = layerDefinition.GetFieldDefn(i).GetType()
    type_name = layerDefinition.GetFieldDefn(i).GetFieldTypeName(type)
    fields_shape.append(nom_champs.lower())
    fields_types[nom_champs.lower()] = type_name.lower()

dicTests[typecontrole]()

#Génération du rapport
#On parcourt le tableau de résultats
entete=u"""
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Rapport du plan {0}</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js"></script>
</head>
<body>

""".format(fichiershape)
log.write(entete.encode('utf-8'))


baspage=u"""
</body>
</html>
"""
log.write(baspage.encode('utf-8'))









