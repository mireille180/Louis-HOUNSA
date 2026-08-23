const KEY = "ma_survie_data";

let data = JSON.parse(
    localStorage.getItem(KEY) ||
    '{"operations":[],"objectif":0}'
);


// =============================
// FORMATAGE FCFA
// =============================

function fcfa(nombre) {

    return new Intl.NumberFormat("fr-FR")
        .format(Math.round(nombre))
        + " F CFA";
}


// =============================
// SAUVEGARDE
// =============================

function sauvegarder() {

    localStorage.setItem(
        KEY,
        JSON.stringify(data)
    );

    afficher();
}


// =============================
// AJOUTER UNE OPÉRATION
// =============================

function ajouter(type) {

    let montant = prompt(
        "Montant en F CFA :"
    );

    if (montant === null)
        return;

    montant = Number(montant);

    if (!Number.isFinite(montant) ||
        montant <= 0) {

        alert("Montant incorrect.");
        return;
    }


    let description = prompt(
        "Description :"
    );

    if (!description)
        description = "Opération";


    data.operations.unshift({

        type: type,

        montant: montant,

        description: description,

        date: new Date()
            .toLocaleString("fr-FR")

    });


    sauvegarder();
}


// =============================
// OBJECTIF
// =============================

function objectif() {

    let montant = Number(
        document.getElementById(
            "objectifInput"
        ).value
    );


    if (!Number.isFinite(montant) ||
        montant < 0) {

        alert("Montant incorrect.");
        return;
    }


    data.objectif = montant;

    sauvegarder();
}


// =============================
// CALCULS
// =============================

function calculer() {

    let revenus = 0;

    let depenses = 0;

    let epargne = 0;


    data.operations.forEach(op => {

        if (op.type === "revenu")
            revenus += op.montant;

        if (op.type === "depense")
            depenses += op.montant;

        if (op.type === "epargne")
            epargne += op.montant;

    });


    let solde =
        revenus -
        depenses -
        epargne;


    return {

        revenus,

        depenses,

        epargne,

        solde

    };
}


// =============================
// BUDGET QUOTIDIEN
// =============================

function budgetQuotidien(solde) {

    let maintenant =
        new Date();


    let dernierJour =
        new Date(
            maintenant.getFullYear(),
            maintenant.getMonth() + 1,
            0
        ).getDate();


    let jour =
        maintenant.getDate();


    let joursRestants =
        dernierJour - jour + 1;


    if (joursRestants <= 0)
        return 0;


    if (solde <= 0)
        return 0;


    return Math.floor(
        solde / joursRestants
    );
}


// =============================
// AFFICHAGE
// =============================

function afficher() {

    let total =
        calculer();


    document.getElementById(
        "revenus"
    ).textContent =
        fcfa(total.revenus);


    document.getElementById(
        "depenses"
    ).textContent =
        fcfa(total.depenses);


    document.getElementById(
        "epargne"
    ).textContent =
        fcfa(total.epargne);


    document.getElementById(
        "solde"
    ).textContent =
        fcfa(total.solde);


    let budget =
        budgetQuotidien(
            total.solde
        );


    document.getElementById(
        "budget"
    ).textContent =
        "Budget conseillé aujourd'hui : "
        + fcfa(budget);


    // =========================
    // OBJECTIF
    // =========================

    let pourcentage = 0;


    if (data.objectif > 0) {

        pourcentage =
            Math.round(
                total.epargne *
                100 /
                data.objectif
            );


        if (pourcentage > 100)
            pourcentage = 100;

    }


    document.getElementById(
        "progression"
    ).textContent =
        pourcentage + " %";


    document.getElementById(
        "barre"
    ).style.width =
        pourcentage + "%";


    document.getElementById(
        "objectifTexte"
    ).textContent =
        fcfa(total.epargne)
        + " / "
        + fcfa(data.objectif);


    // =========================
    // HISTORIQUE
    // =========================

    let historique =
        document.getElementById(
            "historique"
        );


    if (data.operations.length === 0) {

        historique.innerHTML =
            "Aucune opération.";

        return;

    }


    historique.innerHTML =
        data.operations.map(op => {

            let icone = "💰";


            if (op.type === "revenu")
                icone = "💵";


            if (op.type === "depense")
                icone = "💸";


            if (op.type === "epargne")
                icone = "🏦";


            return `

                <div class="item">

                    ${icone}

                    <b>
                        ${fcfa(op.montant)}
                    </b>

                    <br>

                    ${op.description}

                    <br>

                    <small>
                        ${op.date}
                    </small>

                </div>

            `;

        }).join("");

}


// =============================
// EFFACER LES DONNÉES
// =============================

function effacer() {

    let confirmation =
        confirm(
            "Supprimer toutes les données ?"
        );


    if (!confirmation)
        return;


    data = {

        operations: [],

        objectif: 0

    };


    sauvegarder();
}


// =============================
// INITIALISATION
// =============================

afficher();
