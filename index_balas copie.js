function afficheTransport(valeur, description) {

    console.table(description + valeur);
}
function miniliMethod(supply, demand, costs) {
    let m = supply.length;
    let n = demand.length;
    let allocations = new Array(m).fill(0).map(() => new Array(n).fill(0));
    let totalCost = 0;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Trouver l'indice de la colonne avec le coût minimum sur la ligne actuelle
            let minCostColIndex = -1;
            let minCost = Infinity;
            for (let k = 0; k < n; k++) {
                if (costs[i][k] < minCost && demand[k] > 0) {
                    minCost = costs[i][k];
                    minCostColIndex = k;
                }
            }

            if (minCostColIndex !== -1 && supply[i] > 0 && demand[minCostColIndex] > 0) {
                // Allouer autant que possible à la cellule avec le coût minimum sur la ligne
                let quantity = Math.min(supply[i], demand[minCostColIndex]);
                allocations[i][minCostColIndex] = quantity;
                totalCost += quantity * costs[i][minCostColIndex];
                supply[i] -= quantity;
                demand[minCostColIndex] -= quantity;
            }
        }
    }

    return { allocations: allocations, totalCost: totalCost };
}

//Creer structure Association
function creerAssociation(transportInitial, alloc, lignesLabels, colonnesLabels) {
    let arcZ = [];
    let valArc = [];
    for (let i = 0; i < transportInitial.length; i++) {
        for (let j = 0; j < transportInitial[0].length; j++) {
            if (alloc[i][j] > 0) {
                arcZ.push(lignesLabels[i] + String(colonnesLabels[j]));
                valArc.push(transportInitial[i][j]);  // Ajouter le coût unitaire à l'association
            }
        }
    }
    return { arcZ, valArc };
}

//TROUVER LE MAXIMUM 
function maxLi(ligne) {
    let maximum = -Infinity;
    let postionMax = null;
    for (let i = 0; i < ligne.length; i++) {
        if (ligne[i] > maximum) {
            maximum = ligne[i];
            postionMax = i;
        }
    }
    return { maximum, postionMax };
}

function trouverPremierPotentiel(position, solution, potentiel) {
    for (let i = 0; i < solution.length; i++) {
        if (i === position) {
            let [source, dest] = solution[i].split('');
            potentiel.push({ sommet: source, value: 0 });
        }
    }
}

function trouverPotentiel(zArc, zValeur, transport, ligneLabels, colonneLabels) {
    let z = zArc.slice();
    var toutepotentiel = [];
    let arcDegenerer = null;
    let { maximum, postionMax } = maxLi(zValeur);
    trouverPremierPotentiel(postionMax, zArc, toutepotentiel);
    let i = 0;
    while (zArc.length != 0 && i < toutepotentiel.length) {
        let sommet = toutepotentiel[i].sommet;
        let value = toutepotentiel[i].value;
        let positionElementTrouver = [];
        for (let j = 0; j < zArc.length; j++) {
            let [source, dest] = zArc[j].split('');
            if (sommet === source) {
                toutepotentiel.push({ sommet: dest, value: value + zValeur[j] });
                positionElementTrouver.push(j);
            } else if (sommet === dest) {
                toutepotentiel.push({ sommet: source, value: value - zValeur[j] });
                positionElementTrouver.push(j);
            }
        }
        if (positionElementTrouver.length != '') {
            zArc = zArc.filter((value, index) => !positionElementTrouver.includes(index));
            zValeur = zValeur.filter((value, index) => !positionElementTrouver.includes(index));
        }
        i++;
    }

    if (zArc.length !== 0) {
        console.log("Misy cas dégénérer");
        console.table("Cas dégénerer : " + zArc);
        console.table("ZValeur : " + zValeur);
        let [source, dest] = zArc[0].split('');
        arcDegenerer = toutepotentiel[0].sommet + dest;
        let valDegenerer = prendreValeurArcs(transport, ligneLabels, colonneLabels, arcDegenerer);
        z.push(arcDegenerer);
        zArc.push(arcDegenerer);
        zValeur.push(valDegenerer);
    }

    i = 0;
    while (zArc.length != 0 && i < toutepotentiel.length) {
        let sommet = toutepotentiel[i].sommet;
        let value = toutepotentiel[i].value;
        let positionElementTrouver = [];
        for (let j = 0; j < zArc.length; j++) {
            let [source, dest] = zArc[j].split('');
            if (sommet === source) {
                toutepotentiel.push({ sommet: dest, value: value + zValeur[j] });
                positionElementTrouver.push(j);
            } else if (sommet === dest) {
                toutepotentiel.push({ sommet: source, value: value - zValeur[j] });
                positionElementTrouver.push(j);
            }
        }
        if (positionElementTrouver.length != '') {
            zArc = zArc.filter((value, index) => !positionElementTrouver.includes(index));
            zValeur = zValeur.filter((value, index) => !positionElementTrouver.includes(index));
        }
        i++;
    }

    toutepotentiel.sort((a, b) => {
        const sommetA = a.sommet.toUpperCase();
        const sommetB = b.sommet.toUpperCase();

        if (isNaN(sommetA) && isNaN(sommetB)) {
            if (sommetA < sommetB) {
                return -1;
            }
            if (sommetA > sommetB) {
                return 1;
            }
            return 0;
        } else if (isNaN(sommetA) || isNaN(sommetB)) {
            if (isNaN(sommetA)) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return a.sommet - b.sommet;
        }
    });
    return { toutepotentiel, z, arcDegenerer };
};

function estUnCasDegenere(lignelabel, colonnelabel, tableau) {
    var nombreLiens = 0;
    let noeuds = lignelabel.concat(colonnelabel);
    for (var i = 0; i < tableau.length; i++) {
        for (var j = 0; j < tableau[i].length; j++) {
            if (tableau[i][j] != 0) nombreLiens++;
        }
    }
    return (nombreLiens != noeuds.length - 1);
}

function prendreValeurArcs(transp, ligne, colonne, arcs) {
    let val;
    let [source, dest] = arcs.split('');
    let indiceLigne = ligne.indexOf(source);
    let indiceColonne = colonne.indexOf(dest);
    val = transp[indiceLigne][indiceColonne];
    return val;
}

function trouverNonSolution(lignes, colonnes, solution, transp) {
    let nonArc = [];
    let valNonArc = [];
    for (let i = 0; i < lignes.length; i++) {
        for (let j = 0; j < colonnes.length; j++) {
            let arcs = lignes[i] + String(colonnes[j]);

            if (!solution.includes(arcs)) {
                nonArc.push(arcs);
                valNonArc.push(transp[i][j]);
            }
        }
    }
    return { nonArc, valNonArc };
}

function calculSigma(nonArc, valNonArc, potentiel) {
    let sigma = [];
    for (let i = 0; i < nonArc.length; i++) {

        let [src, dest] = nonArc[i].split('');
        let valsrc = trouverValPotentiel(src, potentiel);
        let valdest = trouverValPotentiel(dest, potentiel);
        let sig = valsrc + valNonArc[i] - valdest;
        let sign = 0 <= sig ? 'P' : 'N';
        sigma.push({ nonarc: nonArc[i], valeur: sig, signe: sign });
    }
    return sigma;
}

function trouverValPotentiel(sommet, toutepotentiel) {
    let val = null;
    for (let i = 0; i < toutepotentiel.length; i++) {
        if (toutepotentiel[i].sommet == sommet) {
            val = toutepotentiel[i].value;
            break;
        }
    }
    return val;
}

function trouverNegative(sigma) {
    let negative = [];
    negative = sigma.filter(item => item.valeur < 0);
    return negative;
}

//marquage 
function marquage(tableau, row, col) {
    var chemin = [];
    var stop = false;
    var target = 'ligne';
    var data = { ligne: row, colonne: col, value: tableau[row][col], marque: '+' }; // premier chemin
    var ligneActuel = row;
    var colonneActuel = col;
    chemin.push(data);

    while (!stop) {
        if (target == 'ligne') {
            for (var i = 0; i < tableau.length; i++) {
                if (tableau[i][colonneActuel] != 0 && i != ligneActuel) {
                    if (i == row && colonneActuel != col) {
                        chemin.push({ ligne: i, colonne: colonneActuel, value: tableau[i][colonneActuel], marque: '-' });
                        stop = true; // on sort de la boucle
                        break;
                    }
                    if (isTheCorrectWayForLine(tableau, i, colonneActuel, row)) {
                        chemin.push({ ligne: i, colonne: colonneActuel, value: tableau[i][colonneActuel], marque: '-' });
                        ligneActuel = i;
                        target = 'colonne';
                    }
                }
            }
        }
        else {
            for (var j = 0; j < tableau[ligneActuel].length; j++) {
                if (j != colonneActuel && tableau[ligneActuel][j] != 0 && isTheCorrectwayForColumn(tableau, ligneActuel, j, row)) {
                    chemin.push({ ligne: ligneActuel, colonne: j, value: tableau[ligneActuel][j], marque: '+' });
                    colonneActuel = j;
                    target = 'ligne';
                }
            }
        }
    }
    return chemin;
}

// Au cas où on doit, choisir entre différents chemin, cette fonction va nous permettre de trouver le bon pour la colonne
function isTheCorrectwayForColumn(table, ligne, colonne, finalRow) {
    for (var i = 0; i < table.length; i++) {
        // On vérifie si on est déjà de retour à la case depart (on a terminé) ===>>> on verifie si la ligne correspond à la ligne de depart
        if (i == finalRow && table[i][colonne] != 0) return true;
        if (i != ligne && table[i][colonne] != 0)
            if (isTheCorrectWayForLine(table, i, colonne, finalRow))
                return true;
    }
    return false;
}
// Au cas où on doit, choisir entre différents chemin, cette fonction va nous permettre de trouver le bon pour la ligne 
function isTheCorrectWayForLine(table, ligne, colonne, finalRow) {
    for (var i = 0; i < table[ligne].length; i++) {
        if (i != colonne && table[ligne][i] != 0)
            if (isTheCorrectwayForColumn(table, ligne, i, finalRow))
                return true;
    }
    return false;
}

function maxGain(listegain) {
    let maxGain = listegain[0].gain;
    let indexMax = 0;
    for (let i = 1; i < listegain.length; i++) {
        if (listegain[i].gain < maxGain) { // on utilise l'opérateur < car c'est un nombre négatif, le gain maximum sera le plus petit
            maxGain = listegain[i].gain;
            indexMax = i;
        }
    }
    return indexMax;
}

function cheminEtGain(resultAllocations, ligne, colonne, negative, totalCost) {
    // Appeler la fonction marquage pour chaque arc négatif
    let listegain = [];
    let listeminimum = [];
    for (let i = 0; i < negative.length; i++) {
        const nonarc = negative[i].nonarc;
        const valmoins = negative[i].valeur;
        const indiceLigne = ligne.indexOf(nonarc[0]);
        const indiceColonne = colonne.indexOf(nonarc[1]);
        if (indiceLigne >= 0 && indiceLigne < resultAllocations.length && indiceColonne >= 0 && indiceColonne < resultAllocations[0].length) {
            let minimum = Infinity;
            let chemin = marquage(resultAllocations, indiceLigne, indiceColonne);

            for (let j = 0; j < chemin.length; j++) {
                if (chemin[j].marque === '-') {
                    minimum = Math.min(chemin[j].value, minimum);
                }
            }
            if (!listeminimum.includes(nonarc, minimum)) {
                listeminimum.push({ nonarc, minimum });
            }
            const gain = minimum * valmoins;
            if (!listegain.includes(nonarc, gain)) {
                listegain.push({ nonarc, gain });
            }
        } else {
            console.log(`Indices invalides pour l'arc ${nonarc} : (${indiceLigne}, ${indiceColonne})`);
        }
    }
    // Trouvez l'index du gain maximum
    let indexMaxGain = maxGain(listegain);
    // Trouvez le gain maximum dans la liste
    const gainMax = listegain[indexMaxGain];
    // Trouvez l'arc correspondant au gain maximum dans la liste des arcs non solution
    const { nonarc } = negative.find(item => item.nonarc === gainMax.nonarc);

    // Obtenez le chemin correspondant à l'arc non solution                                          
    const indiceLigne = ligne.indexOf(nonarc[0]);
    const indiceColonne = colonne.indexOf(nonarc[1]);
    const cheminMaxGain = marquage(resultAllocations, indiceLigne, indiceColonne);
    const minimum = listeminimum[indexMaxGain];
    // Parcourez le chemin et ajustez les valeurs en conséquence
    for (let i = 0; i < cheminMaxGain.length; i++) {
        let { ligne, colonne, value, marque } = cheminMaxGain[i];
        if (marque === '+') {
            // Ajoutez le minimum à la valeur de la cellule si la marque est '+'
            resultAllocations[ligne][colonne] += minimum.minimum;
        } else if (marque === '-') {
            // Soustrayez le minimum de la valeur de la cellule si la marque est '-'
            resultAllocations[ligne][colonne] -= minimum.minimum;
        }
    }
    //Calcul Z après gain
    const z = totalCost + gainMax.gain;
    return { resultAllocations, z, listeminimum, listegain, gainMax, negative, cheminMaxGain };
}

function changerValEpsilon(result, ligne, colonne, arcs) {
    let [source, dest] = arcs.split('');
    let indiceLigne = ligne.indexOf(source);
    let indiceColonne = colonne.indexOf(dest);
    result[indiceLigne][indiceColonne] = Number.EPSILON;
    return result;
}

// Fonction pour dessiner le graphique GoJS
function creerGraphe(potentiels, Z, valeurArc, id, arcDegenerer) {
    var $ = go.GraphObject.make;
    var graphe = new go.Diagram(id);
    graphe.nodeTemplate = $(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Panel,
            $(go.Shape, "Ellipse", { fill: "lightgray", width: 80, height: 30 }),
            $(go.TextBlock,
                { margin: 2, width: 25, textAlign: 'center' },
                new go.Binding("text", "value"),
                { background: "cyan", alignment: go.Spot.TopLeft }
            )
        ),
        $(go.TextBlock, { margin: 5 },
            new go.Binding("text", "key")),
    );
    graphe.linkTemplate = $(go.Link,
        { curve: go.Link.Bezier },
        $(go.Shape, { strokeWidth: 2 },
            new go.Binding("stroke", "Casdegenerer", val => val ? "red" : "black")),
        $(go.TextBlock,
            new go.Binding("text", "text"),
            new go.Binding("stroke", "Casdegenerer", val => val ? "red" : "black"),
            { segmentOffset: new go.Point(0, -10) }
        )
    );
    let liens = [];
    let sommets = [];
    let potA = potentiels.filter(item => isNaN(parseInt(item.sommet)));
    let potN = potentiels.filter(item => !isNaN(parseInt(item.sommet)));
    let alpha = [];
    let nb = [];
    for (let i = 0; i < potA.length; i++) {
        alpha.push({ key: potA[i].sommet, loc: `50 ${(i + 1) * 100}`, value: potA[i].value });
    }
    for (let i = 0; i < potN.length; i++) {
        nb.push({ key: potN[i].sommet, loc: `270 ${(i + 1) * 70}`, value: potN[i].value });
    }
    sommets.push(...alpha, ...nb);
    for (let j = 0; j < Z.length; j++) {
        let [source, dest] = Z[j].split('');
        let DegenererArc = (Z[j] === arcDegenerer);
        //liens.push({ from: source, to: dest, text: valeurArc[j] });
        liens.push({ from: source, to: dest, text: valeurArc[j], Casdegenerer: DegenererArc });
    }
    graphe.model = new go.GraphLinksModel(sommets, liens);
}

function creertableau(rows, cols) {
    var table = "<table>";
    let depot = [];
    let dest = [];
    for (var i = 0; i <= rows + 1; i++) {
        table += "<tr>";
        for (var j = 0; j <= cols + 1; j++) {
            if (i === 0 && j === 0) {
                table += "<th></th>";
            } else if (i === 0) {
                table += "<th>" + (j === cols + 1 ? "Disponible" : " ") + (j === cols + 1 ? "" : " " + j) + "</th>";
                if (!(j === 0 || j === cols + 1)) {
                    dest.push(j.toString());
                }
            } else if (j === 0) {
                var rowHeader = String.fromCharCode(64 + i); // A, B, C, ...
                var headerText = (i === rows + 1 ? "Demande" : "" + " " + rowHeader);
                if (i === rows + 1) {
                    headerText = "Demande";
                } else {
                    headerText = " " + rowHeader;
                    depot.push(rowHeader);
                }
                table += "<th>" + headerText + "</th>";
            } else {
                // Vérification si c'est la dernière ligne ou la dernière colonne
                if (i === rows + 1 && j === cols + 1) {
                    table += "<td id ='lastCell'></td>";
                } else if (i === rows + 1 || j === cols + 1) {
                    table += "<td id ='lastCell' contenteditable = 'true'></td>";
                } else {
                    table += "<td contenteditable = 'true'></td>";
                }
            }
        }
        table += "</tr>";
    }
    table += "</table>";
    return { table, dest, depot };
}

//PRENDRE LES VALEURS DU TABLEAU HTML ET TRANSFORMER SOUS FORME DE MATRICE
function prendreValeurTableauHTML() {
    var transport = [];
    let offre = [];
    let demande = [];
    var dernierColonne = $('#result table tr').find('td,th').length / $('#result table').find('tr').length - 1;
    var dernierLigne = $('#result table').find('tr').length - 1;
    $(' #result table tr').each(function (indiceLigne, lignes) {
        var ligne = [];
        $(lignes).find('td,th').each(function (indiceColonne, cellule) {
            if ((indiceLigne === 0 || indiceColonne === 0) || (indiceColonne === dernierColonne && indiceLigne === dernierLigne)) {
            } else if (indiceLigne === dernierLigne) {
                demande.push(parseInt($(cellule).text()));
            } else if (indiceColonne === dernierColonne) {
                offre.push(parseInt($(cellule).text()));
            } else {
                ligne.push(parseInt($(cellule).text()));
            }
        });
        if (ligne.length != 0) {
            transport.push(ligne);
        }
    });
    return { transport, offre, demande };
}

function balasHammer(offre, demande, couts) {
    let m = offre.length;
    let n = demande.length;
    let allocations = new Array(m).fill(0).map(() => new Array(n).fill(0));
    let copieCouts = couts.map(ligne => ligne.slice());
    let compteur = 1;

    while (compteur < (m + n)) {
        let ColonneCouts = copieCouts[0].map((_, indiceColonne) => copieCouts.map(ligne => ligne[indiceColonne])); // Transposée de couts pour avoir le colonne

        let lignA = diffMin(copieCouts, offre); // Différence entre les minimums lignes
        let colA = diffMin(ColonneCouts, demande); // Différence entre les minimums colonnes

        let max = obtenirMax(lignA, colA); // Trouver maximum entre le tableau lignA et colA
        let indiceRangee = obtenirIndiceMaximum(lignA); // Trouver l'indice maximum dans le tableau lignA
        let indiceColonne = obtenirIndiceMaximum(colA); // Trouver l'indice maximum dans le tableau colA


        /* Trouver l'indice du minimum à la différence maximale */
        if (max == lignA[indiceRangee]) {
            let rangeeDuTableau = copieCouts[indiceRangee];
            indiceColonne = rangeeDuTableau.indexOf(Math.min.apply(null, rangeeDuTableau.filter(n => n != 0)));
        } else if (max == colA[indiceColonne]) {
            let colonneDuTableau = obtenirColonne(copieCouts, indiceColonne);
            indiceRangee = colonneDuTableau.indexOf(Math.min.apply(null, colonneDuTableau.filter(n => n != 0)));
        }

        /**/

        for (let i = 0; i < copieCouts.length; i++) {
            for (let j = 0; j < copieCouts[i].length; j++) {
                if (i == indiceRangee && j == indiceColonne) {
                    if (offre[i] < demande[j]) {
                        allocations[i][j] = offre[i];
                        offre[i] = 0;
                        demande[j] = demande[j] - allocations[i][j];
                        remplirRangeeZero(copieCouts, i, demande.length); // Remplir de zéro la rangée traitée
                    } else {
                        allocations[i][j] = demande[j];
                        offre[i] = offre[i] - allocations[i][j];
                        demande[j] = 0;
                        remplirColonneZero(copieCouts, j, offre.length); // Remplir de zéro la colonne traitée
                    }
                }
            }
        }
        compteur++;
    }
    totalCost = calculerTotalCout(couts, allocations);

    return { allocations: allocations, totalCost: totalCost };
}

function diffMin(couts, colonne) {
    var res = [];
    for (var i = 0; i < colonne.length; i++) {
        if (colonne[i] != 0) {
            let min = Math.min.apply(null, couts[i].filter(n => n != 0));
            let secondMin = 0;
            if (minimumDuplique(couts[i]))
                secondMin = min; // Si le minimum est dupliqué
            else
                secondMin = Math.min.apply(null, couts[i].filter(n => (n != min) && (n != 0)));
            res.push(secondMin - min);
        } else
            res.push(0);
    }
    return res;
}

function minimumDuplique(tableau) {
    let min = Math.min.apply(null, tableau.filter(n => n != 0));
    let compteur = 0;
    for (var i = 0; i < tableau.length; i++) {
        if (tableau[i] == min) {
            compteur++;
        }
    }
    return (compteur != 1);
}

function obtenirMax(tabA, tabB) {
    // Concaténer les deux tableaux et utiliser reduce pour trouver le maximum
    let max = [...tabA, ...tabB].reduce((acc, curr) => Math.max(acc, curr));

    // Retourner la valeur maximale
    return max;
}

function obtenirIndiceMaximum(donnee) {
    let max = Math.max.apply(null, donnee);
    return donnee.indexOf(max);
}

function remplirColonneZero(couts, indice, nombreRangees) {
    for (let i = 0; i < nombreRangees; i++) {
        couts[i][indice] = 0;
    }
}

function remplirRangeeZero(couts, indice, nombreColonnes) {
    for (let i = 0; i < nombreColonnes; i++) {
        couts[indice][i] = 0;
    }
}

function obtenirColonne(tableau, col) {
    let colonne = [];
    for (let i = 0; i < tableau.length; i++) {
        colonne.push(tableau[i][col]);
    }
    return colonne;
}

function calculerTotalCout(couts, allocations) {
    var totalCout = 0;
    for (let i = 0; i < allocations.length; i++) {
        for (let j = 0; j < allocations[i].length; j++) {
            totalCout += couts[i][j] * allocations[i][j];
        }
    }
    return totalCout;
}

//AFFICHAGE DES RESULTATS SUR HTML
function afficheAlloc(alloc, ligneLabels, colonneLabels) {
    var tableauHtml = '';
    tableauHtml += '<table class="table-bordered table" id="gris" >';
    tableauHtml += '<thead class="fs-2 font-weight-bold" style = "background-color:lightgray;"><tr><th></th>';
    for (var j = 0; j < colonneLabels.length; j++) {
        tableauHtml += '<th>' + colonneLabels[j] + '</th>';
    }
    tableauHtml += '</tr></thead><tbody>';
    for (var i = 0; i < alloc.length; i++) {
        tableauHtml += '<tr>';
        tableauHtml += '<td class="fs-2 font-weight-bold" style = "background-color:lightgray;">' + ligneLabels[i] + '</td>';

        for (var j = 0; j < alloc[i].length; j++) {
            let val = alloc[i][j];
            if (alloc[i][j] === 0) {
                val = '-';
            }
            if (alloc[i][j] === Number.EPSILON) {
                val = 'ε';
            }
            tableauHtml += '<td>' + val + '</td>';
        }
        tableauHtml += '</tr>';
    }
    tableauHtml += '</tbody></table>';

    return tableauHtml;

}

function afficheSigma(sigma, valNonArc, potentiels) {
    let contenuHTML = '';
    $.each(sigma, function (i, item) {
        var sommets = item.nonarc.split('');
        var prem = sommets[0];
        var dem = sommets[1];
        // Trouver les valeurs potentielles correspondantes
        var premValue = potentiels.find(function (element) {
            return element.sommet === prem;
        }).value;
        var demValue = potentiels.find(function (element) {
            return element.sommet === dem;
        }).value;
        var delta = item.valeur;
        // Créer la phrase
        var phrase = '\u03B4(' + prem + ',' + dem + ') = ' + premValue + ' + ' + valNonArc[i] + ' - ' + demValue + ' = ' + delta + ' (' + item.signe + ')';
        if (item.signe === 'N') {
            contenuHTML += '<h4 style =" text-align:center;font-size:18px;color:red;">' + phrase + '</h4>';
        } else {
            contenuHTML += '<h4 style =" text-align:center;font-size:18px;">' + phrase + '</h4>';
        }
    });
    return contenuHTML;
}

function afficheNegatif(negatif) {
    let contenuHTML = '';
    // Parcourir chaque élément de sigma
    $.each(negatif, function (i, item) {
        var sommets = item.nonarc.split('');
        var prem = sommets[0];
        var dem = sommets[1];
        var delta = item.valeur;
        // Créer la phrase
        var phrase = '\u03B4(' + prem + ',' + dem + ') = ' + delta;
        contenuHTML += '<div id="negatif" style = "text-align:center;font-size:24px;">' + phrase + '</div>';
    })
    return contenuHTML;
}

function afficheGain(negatif, listMin, listGain, gainMax) {
    let contenuHTML = '';
    for (var i = 0; i < listGain.length; i++) {
        var sommets = listGain[i].nonarc.split('');
        var prem = sommets[0];
        var dem = sommets[1];
        var premValue;
        for (var j = 0; j < listMin.length; j++) {
            if (listMin[j].nonarc === (prem + dem)) {
                premValue = listMin[j].minimum;
                break;
            }
        }
        var demValue;
        for (var k = 0; k < negatif.length; k++) {
            if (negatif[k].nonarc === (prem + dem)) {
                demValue = negatif[k].valeur;
                break;
            }
        }
        var gain = listGain[i].gain;
        let gainText = gain;
        if (premValue === Number.EPSILON) {
            premValue = 'ε';
            gainText = '-ε';
        }
        var phrase = 'gain(' + prem + ',' + dem + ') = ' + premValue + ' * ' + demValue + ' = ' + gainText;
        if (gain === gainMax) {
            contenuHTML += '<h4 style = "text-align : center;font-size:24px;color:red;">' + phrase + '</h4>';
        } else {
            contenuHTML += '<h4 style = "text-align : center;font-size:24px">' + phrase + '</h4>';
        }
    }
    return contenuHTML;
}

function afficheMarquage(alloc, ligneLabels, colonneLabels, chemins) {
    var tableauHtml = '';
    tableauHtml += '<table id="jaune" class="table-bordered table">';
    tableauHtml += '<thead class="fs-2 font-weight-bold" style = "background-color:lightgray;"><tr><th></th>';
    // Ajouter les titres de colonne
    for (var j = 0; j < colonneLabels.length; j++) {
        tableauHtml += '<th>' + colonneLabels[j] + '</th>';
    }
    tableauHtml += '</tr></thead><tbody>';
    // Ajouter les allocations aux cellules du tableau
    for (var i = 0; i < alloc.length; i++) {
        tableauHtml += '<tr>';
        tableauHtml += '<td class="fs-2 font-weight-bold" style = "background-color:lightgray;">' + ligneLabels[i] + '</td>'; // Titre de ligne
        for (var j = 0; j < alloc[i].length; j++) {
            var marque = '';
            var valeur = alloc[i][j];

            if (Math.abs(valeur - Number.EPSILON) < Number.EPSILON) {
                valeur = 'ε';
            }
            // Vérifier si la cellule se trouve dans le chemin
            for (var k = 0; k < chemins.length; k++) {
                if (chemins[k].ligne === i && chemins[k].colonne === j) {
                    marque = chemins[k].marque;
                    break;
                }
            }
            if (alloc[i][j] === 0) {
                valeur = '';
            }
            var classeCaseMarquee = marque ? 'case-marquee' : '';
            tableauHtml += '<td class="' + classeCaseMarquee + '">' + valeur + (marque ? ' ' + marque : '') + '</td>';
        }
        tableauHtml += '</tr>';
    }
    tableauHtml += '</tbody></table>';
    return tableauHtml;
}

function afficheOptimal(z) {
    var phrase = '<p id = "optimalp" > La solution optimale est : ' + z + ' !</p>';
    $("#optimal").empty();
    $("#optimal").append(phrase);
}

function affichageFirstStep(copieZ, copieAlloc, ligne, colonne, potentiel, arcZ, valArc, resultArcDegenerer, sigma, valNonArc, Casdegenerer) {
    let casDegenererText = Casdegenerer ? 'Il existe une cas dégéneré.' : '';
    var bloc1 = $('<div>').addClass('col-md-5 col-sm-5 bloc').append(
        $('<center>').append(
            $('<div>').addClass('panel panel-default').append(
                $('<div>').addClass('panel-body').attr('id', 'allocation'),
                $('<div>').addClass('panel-heading').append(
                    $('<h3>').addClass('panel-title').text('Z = ' + copieZ)
                ),
                $('<div>').addClass('panel-heading').append(
                    $('<h3>').addClass('panel-title casdegenerer').text(casDegenererText)
                )
            )
        )
    );

    var bloc2 = $('<div>').addClass('col-md-4 col-sm-4 bloc bloc2').attr('id', 'graphe');

    var bloc3 = $('<div>').addClass('col-md-3 col-sm-3 bloc bloc3').append(
        $('<div>').attr('id', 'sigma').append(
            $('<div>').addClass('titre').text("Sigma"),
            $('<br>')
        ),

    );

    var row = $('<div>').addClass('row ligne').attr('id', 'ligne').append(bloc1, bloc2, bloc3);
    $('#stepBystep').append(row, $('<br>'));

    let tableauAlloc = afficheAlloc(copieAlloc, ligne, colonne);
    $('#allocation').append(tableauAlloc);
    creerGraphe(potentiel, arcZ, valArc, 'graphe', resultArcDegenerer);
    let sigmaHTML = afficheSigma(sigma, valNonArc, potentiel);
    $('#sigma').append(sigmaHTML);
}

//Affichage ETAPE PAR ETAPE
function affichageStepBystep(copieZ, arcZ, valArc, resultArcDegenerer, ligne, colonne, valeurZ, compteur, Casdegenerer, sigma, valNonArc, potentiel, resultatNegative, resultatListeminimum, resultatListegain, resultatGainMaxGain, copieAlloc, resultatCheminMaxGain, negative) {
    let grapheID = 'graphe' + compteur.toString();
    let marquageID = 'marquage' + compteur.toString();
    let allocationID = 'allocation' + compteur.toString();
    let gainID = 'gain' + compteur.toString();
    let sigmaID = 'sigma' + compteur.toString();
    let negatifID = 'negatif' + compteur.toString();
    let casDegenererText = Casdegenerer ? 'Il existe un cas dégénérer.' : '';
    var bloc1 = $('<div>').addClass('col-md-5 col-sm-5 bloc').append(
        $('<center>').append(
            $('<div>').addClass('panel panel-default').append(
                $('<div>').addClass('panel-body').attr('id', allocationID),
                $('<div>').addClass('panel-heading').append(
                    $('<h3>').addClass('panel-title').text('Z = ' + copieZ)
                ),
                $('<div>').addClass('panel-heading').append(
                    $('<h3>').addClass('panel-title casdegenerer').text(casDegenererText)
                )
            )
        )
    );

    var bloc2 = $('<div>').addClass('col-md-4 col-sm-4 bloc bloc2').attr('id', grapheID);

    var bloc3 = $('<div>').addClass('col-md-3 col-sm-3 bloc bloc3').append(
        $('<div>').addClass('sigma').attr('id', sigmaID).append(
            $('<div>').addClass('titre').text("Sigma"),
            $('<br>')
        ),

    );

    var bloc5 = $('<div>').addClass('col-md-7 col-sm-7 bloc bloc5').append(
        $('<div>').addClass('negatif').attr('id', negatifID).append(
            $('<div>').addClass('titre').text("Negatif"),
            $('<br>')
        ),
        $('<div>').addClass('gain').attr('id', gainID).append(
            $('<div>').addClass('titre').text("Gain"),
            $('<br>')
        ),

    );

    let textGain = 'Z = ' + copieZ + '' + resultatGainMaxGain + ' => ' + valeurZ;
    var bloc4 = $('<div>').addClass('col-md-5 col-sm-5 bloc').append(
        $('<center>').append(
            $('<div>').addClass('panel panel-default').append(
                $('<div>').addClass('panel-body').attr('id', marquageID),
                $('<div>').addClass('panel-heading').append(
                    $('<h3>').addClass('panel-title').text(textGain)
                )
            )
        )
    );

    var row = $('<div>').addClass('row ligne').attr('id', 'ligne').append(bloc1, bloc2, bloc3, bloc5, bloc4);
    $('#stepBystep').append(row, $('<br>'));

    let tableauAlloc = afficheAlloc(copieAlloc, ligne, colonne);
    $('#' + allocationID).append(tableauAlloc);
    creerGraphe(potentiel, arcZ, valArc, grapheID, resultArcDegenerer);
    let sigmaHTML = afficheSigma(sigma, valNonArc, potentiel);
    $('#' + sigmaID).append(sigmaHTML);
    let negativeHTML = afficheNegatif(negative);
    $('#' + negatifID).append(negativeHTML);
    let gainHTML = afficheGain(resultatNegative, resultatListeminimum, resultatListegain, resultatGainMaxGain);
    $('#' + gainID).append(gainHTML);
    let tableauMarquage = afficheMarquage(copieAlloc, ligne, colonne, resultatCheminMaxGain);
    $('#' + marquageID).append(tableauMarquage);
}

//MINILI MAIN (transport, supply, demand, ligne, colonne)
function miniliMain(transport, supply, demand, ligne, colonne) {
    let fin = false;
    let compteur = 0;
    let { allocations: allocation, totalCost: valeurZ } = miniliMethod(supply.slice(), demand.slice(), transport, ligne, colonne);

    while (!fin) {
        let copieZ = valeurZ;
        let copieAlloc = allocation.map(row => row.slice());
        let resultat = null;
        let Casdegenerer = estUnCasDegenere(ligne, colonne, allocation);
        let { arcZ, valArc } = creerAssociation(transport, allocation, ligne, colonne);
        let result = trouverPotentiel(arcZ, valArc, transport, ligne, colonne);
        let potentiel = result.toutepotentiel;
        arcZ = result.z.slice();
        if (result.arcDegenerer != null) {
            let valDegenerer = prendreValeurArcs(transport, ligne, colonne, result.arcDegenerer);
            valArc.push(valDegenerer);
            allocation = changerValEpsilon(allocation, ligne, colonne, result.arcDegenerer);
        }
        let { nonArc, valNonArc } = trouverNonSolution(ligne, colonne, arcZ, transport);
        let sigma = calculSigma(nonArc, valNonArc, potentiel);
        let negative = trouverNegative(sigma);
        if (negative.length != 0) {
            resultat = cheminEtGain(allocation, ligne, colonne, negative, valeurZ);
            allocation = resultat.resultAllocations.slice();
            valeurZ = resultat.z;
            affichageStepBystep(copieZ, arcZ, valArc, result.arcDegenerer, ligne, colonne, valeurZ, compteur, Casdegenerer, sigma, valNonArc, potentiel, resultat.negative, resultat.listeminimum, resultat.listegain, resultat.gainMax.gain, copieAlloc, resultat.cheminMaxGain, negative);
        } else {
            fin = true;
            affichageFirstStep(copieZ, copieAlloc, ligne, colonne, potentiel, arcZ, valArc, result.arcDegenerer, sigma, valNonArc, Casdegenerer);
        }
        compteur++;
        console.log("Z = " + valeurZ);
        console.log("------------------------");
    }
    afficheOptimal(valeurZ);
    console.log('-------------Z OPTIMAL--------------');
    console.log(valeurZ);
}

//BALAS HAMMER MAIN
function balasMain(transport, supply, demand, ligne, colonne) {
    let fin = false;
    let compteur = 0;
    let { allocations: allocation, totalCost: valeurZ } = balasHammer(supply.slice(), demand.slice(), transport, ligne, colonne);

    while (!fin) {
        let copieZ = valeurZ;
        let copieAlloc = allocation.map(row => row.slice());
        let resultat = null;
        let Casdegenerer = estUnCasDegenere(ligne, colonne, allocation);
        let { arcZ, valArc } = creerAssociation(transport, allocation, ligne, colonne);
        let result = trouverPotentiel(arcZ, valArc, transport, ligne, colonne);
        let potentiel = result.toutepotentiel;
        arcZ = result.z.slice();
        if (result.arcDegenerer != null) {
            let valDegenerer = prendreValeurArcs(transport, ligne, colonne, result.arcDegenerer);
            valArc.push(valDegenerer);
            allocation = changerValEpsilon(allocation, ligne, colonne, result.arcDegenerer);
        }
        let { nonArc, valNonArc } = trouverNonSolution(ligne, colonne, arcZ, transport);
        let sigma = calculSigma(nonArc, valNonArc, potentiel);
        let negative = trouverNegative(sigma);
        if (negative.length != 0) {
            resultat = cheminEtGain(allocation, ligne, colonne, negative, valeurZ);
            allocation = resultat.resultAllocations.slice();
            valeurZ = resultat.z;
            affichageStepBystep(copieZ, arcZ, valArc, result.arcDegenerer, ligne, colonne, valeurZ, compteur, Casdegenerer, sigma, valNonArc, potentiel, resultat.negative, resultat.listeminimum, resultat.listegain, resultat.gainMax.gain, copieAlloc, resultat.cheminMaxGain, negative);
        } else {
            fin = true;
            affichageFirstStep(copieZ, copieAlloc, ligne, colonne, potentiel, arcZ, valArc, result.arcDegenerer, sigma, valNonArc, Casdegenerer);
        }
        compteur++;
        console.log("Z = " + valeurZ);
        console.log("------------------------");
    }
    afficheOptimal(valeurZ);
    console.log('-------------Z OPTIMAL--------------');
    console.log(valeurZ);
}

$(document).ready(function () {
    let table, colonneLabels, ligneLabels;
    $('#resoudre, #resoudre1').hide();

    //Créer un tableau résoudre en MINILI
    $("#submitButton").click(function () {
        var rows = parseInt($("#inputRows").val());
        var cols = parseInt($("#inputCols").val());

        if (isNaN(rows) || isNaN(cols)) {
            alert("Veuillez entrer des nombres valides.");
            return;
        } else {
            let result = creertableau(rows, cols);
            table = result.table;
            colonneLabels = result.dest;
            ligneLabels = result.depot;
            $('.container').hide();
            $("#result").html(table);
            $('#resoudre, #resoudre1').show();
        }
    });

    //Résoudre en  MINILI
    $(document).on("click", "#resoudre", function () {
        var cellules = $("#result table td");
        if (isNaN($(cellules).text()) || (!/^[-+]?\d*\.?\d+$/.test($(cellules).text())) || $(cellules).text().trim() === '' || $(cellules).text().trim() === 0) {
            alert("Veuillez remplir avec des nombres valides.");
            return;
        }
        else {
            $('#stepBystep').empty();
            $('#optimal').empty();
            let { transport, offre, demande } = prendreValeurTableauHTML();
            let sommeOffre = offre.reduce((acc, recent) => acc + recent, 0);
            let sommeDemande = demande.reduce((acc, recent) => acc + recent, 0);
            if (sommeOffre != sommeDemande) {
                alert('La somme des disponibles (' + sommeOffre + ') est diffréntes des demandes (' + sommeDemande + ').\n Veuillez vérifier vos données.');
            } else {
                console.table(transport);
                console.table("supply:" + offre);
                console.table("demande:" + demande);
                console.table("lignelabel:" + ligneLabels);
                console.table("colonnelabel:" + colonneLabels);
                miniliMain(transport, offre, demande, ligneLabels, colonneLabels);
            }

        }
    });


    //Résoudre en  BALAS HAMMER
    $("#resoudre1").click(function () {
        var cellules = $("#result table td");
        if (isNaN($(cellules).text()) || (!/^[-+]?\d*\.?\d+$/.test($(cellules).text())) || $(cellules).text().trim() === '' || $(cellules).text().trim() === 0) {
            alert("Veuillez remplir avec des nombres valides.");
            return;
        }
        else {
            $('#stepBystep').empty();
            $('#optimal').empty();
            let { transport, offre, demande } = prendreValeurTableauHTML();
            let sommeOffre = offre.reduce((acc, recent) => acc + recent, 0);
            let sommeDemande = demande.reduce((acc, recent) => acc + recent, 0);
            if (sommeOffre != sommeDemande) {
                alert('La somme des disponibles (' + sommeOffre + ') est diffréntes des demandes (' + sommeDemande + ').\n Veuillez vérifier vos données.');
            } else {
                console.table(transport);
                console.table("supply:" + offre);
                console.table("demande:" + demande);
                console.table("lignelabel:" + ligneLabels);
                console.table("colonnelabel:" + colonneLabels);
                balasMain(transport, offre, demande, ligneLabels, colonneLabels);
            }

        }
    });
});