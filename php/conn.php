<?php
//connexion à la base de données postgresql
$connex=pg_connect("hostaddr=192.168.0.246 port=5432 dbname=syndicat_eau_prod user=intranet password=1TranEt");
if(! $connex) {
    echo "Connexion a la base syndicat_eau_prod.intranet impossible !";
} else {
    echo "connexion succeeded !";
}

?>
