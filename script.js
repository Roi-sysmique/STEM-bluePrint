const questionsOptions = new Map([
  ["Combien de douches prenez-vous par semaine ?", 
    new Map([["0-2", false], ["3-5", false], ["6-8", false], ["9+", false]])
  ],
  ["Durée moyenne d’une douche ?", 
    new Map([["< 5 min", false], ["5–9 min", false], ["10–14 min", false], ["≥ 15 min", false]])
  ],
  ["Votre pomme de douche est-elle à faible débit ?", 
    new Map([["Oui", false], ["Un peu", false], ["Non", false], ["Je ne sais pas", false]])
  ],
  ["Combien de bains prenez-vous par semaine ?", 
    new Map([["0", false], ["1", false], ["2", false], ["3+", false]])
  ],
  ["Nombre moyen de chasses d’eau par jour :", 
    new Map([["0–3", false], ["4–6", false], ["7–9", false], ["10+", false]])
  ],
  ["Type de toilette :", 
    new Map([["Économe (≤6 L)", false], ["Moyen (6–9 L)", false], ["Ancien (>9 L)", false], ["Je ne sais pas", false]])
  ],
  ["Utilisation du lave-vaisselle (cycles/semaine) :", 
    new Map([["0", false], ["1–2", false], ["3–5", false], ["6+", false]])
  ],
  ["Vaisselle à la main (sessions/semaine) :", 
    new Map([["0–2", false], ["3–5", false], ["6–8", false], ["9+", false]])
  ],
  ["Lessives (par semaine) :", 
    new Map([["0–1", false], ["2–3", false], ["4–5", false], ["6+", false]])
  ],
  ["Eau pour boire et cuisiner (L/jour) :", 
    new Map([["< 2 L", false], ["2–4 L", false], ["5–7 L", false], ["≥ 8 L", false]])
  ],
  ["Arrosage du jardin (minutes/semaine) :", 
    new Map([["0", false], ["1–60", false], ["61–180", false], ["> 180", false]])
  ],
  ["Lavage de voiture à la maison :", 
    new Map([["Jamais", false], ["1×/mois", false], ["2–3×/mois", false], ["1×/semaine ou +", false]])
  ],
  ["Repas avec viande rouge (par semaine) :", 
    new Map([["0", false], ["1–2", false], ["3–5", false], ["6+", false]])
  ],
  ["Repas avec volaille/poisson (par semaine) :", 
    new Map([["0–2", false], ["3–5", false], ["6–8", false], ["9+", false]])
  ],
  ["Repas végétariens (par semaine) :", 
    new Map([["0–2", false], ["3–5", false], ["6–10", false], ["> 10", false]])
  ],
  ["T-shirts achetés par an :", 
    new Map([["0–1", false], ["2–4", false], ["5–7", false], ["8+", false]])
  ],
  ["Jeans ou vestes achetés par an :", 
    new Map([["0–1", false], ["1–2", false], ["3–4", false], ["5+", false]])
  ],
  ["Fréquence d’achat d’un nouveau smartphone :", 
    new Map([["Aucun (≥5 ans)", false], ["Tous les 3–4 ans", false], ["Tous les 2 ans", false], ["Chaque année", false]])
  ]
]);


let questions = []
let answers_list = []
for (let [question, options] of questionsOptions){
		questions.push(question)
		for (let [answer, state] of options){
			answers_list.push(answer)
		}
}

let question_index = 0;
const title = document.querySelector('.title');
const answers_container = document.querySelector('.answers-container');
let answers = Array.from(answers_container.children);

const button = document.querySelector('.next-container')
let answers_options = [];
const refreshpage = function(){
	if (question_index < questions.length){
		title.textContent = questions[question_index]
		for (let i=0; i < 4; i++){
			answers[i].textContent = answers_list[i]
		}
		answers_list = answers_list.slice(4, answers_list.length)
		question_index++
	} else{
		calculateWaterConsumption()
	}
}


refreshpage()
for (let child of answers){
	child.addEventListener('click', (event) => {
		const currentQuestion = questions[question_index - 1]; 
		questionsOptions.get(currentQuestion).set(event.currentTarget.textContent, true);
		refreshpage();
	});

}

function calculateWaterConsumption() {
    let total = 0;

    for (let [question, options] of questionsOptions) {
        let selected = null;

        // Trouver la réponse cochée (celle qui est true)
        for (let [answer, state] of options) {
            if (state === true) {
                selected = answer;
                break;
            }
        }

        if (!selected) continue; // rien sélectionné → on skip

        // ---- CALCUL EN FONCTION DE LA QUESTION ---- //

        switch (question) {

            // ----- DOUCHES ----- //
            case "Combien de douches prenez-vous par semaine ?":
                total += { "0-2": 2*60, "3-5": 4*60, "6-8": 7*60, "9+": 10*60 }[selected];
                break;

            case "Durée moyenne d’une douche ?":
                total += { "< 5 min": 30, "5–9 min": 60, "10–14 min": 100, "≥ 15 min": 150 }[selected];
                break;

            case "Votre pomme de douche est-elle à faible débit ?":
                total += { "Oui": -20, "Un peu": -10, "Non": 0, "Je ne sais pas": 0 }[selected];
                break;

            // ----- BAINS ----- //
            case "Combien de bains prenez-vous par semaine ?":
                total += { "0": 0, "1": 150, "2": 300, "3+": 500 }[selected];
                break;

            // ----- TOILETTE ----- //
            case "Nombre moyen de chasses d’eau par jour :":
                total += { "0–3": 18, "4–6": 36, "7–9": 54, "10+": 70 }[selected];
                break;

            case "Type de toilette :":
                total += { 
                    "Économe (≤6 L)": -10,
                    "Moyen (6–9 L)": 0,
                    "Ancien (>9 L)": +20,
                    "Je ne sais pas": 0
                }[selected];
                break;

            // ----- LAVE-VAISSELLE ----- //
            case "Utilisation du lave-vaisselle (cycles/semaine) :":
                total += { "0": 0, "1–2": 20, "3–5": 50, "6+": 80 }[selected];
                break;

            // ----- VAISSELLE ----- //
            case "Vaisselle à la main (sessions/semaine) :":
                total += { "0–2": 10, "3–5": 30, "6–8": 60, "9+": 90 }[selected];
                break;

            // ----- LESSIVES ----- //
            case "Lessives (par semaine) :":
                total += { "0–1": 60, "2–3": 150, "4–5": 250, "6+": 300 }[selected];
                break;

            // ----- CONSOMMATION ----- //
            case "Eau pour boire et cuisiner (L/jour) :":
                total += { "< 2 L": 14, "2–4 L": 28, "5–7 L": 49, "≥ 8 L": 70 }[selected];
                break;

            // ----- JARDIN ----- //
            case "Arrosage du jardin (minutes/semaine) :":
                total += { "0": 0, "1–60": 100, "61–180": 300, "> 180": 600 }[selected];
                break;

            // ----- VOITURE ----- //
            case "Lavage de voiture à la maison :":
                total += { "Jamais": 0, "1×/mois": 150, "2–3×/mois": 400, "1×/semaine ou +": 600 }[selected];
                break;

            // ----- ALIMENTATION ----- //
            case "Repas avec viande rouge (par semaine) :":
                total += { "0": 0, "1–2": 800, "3–5": 2000, "6+": 3500 }[selected];
                break;

            case "Repas avec volaille/poisson (par semaine) :":
                total += { "0–2": 200, "3–5": 600, "6–8": 900, "9+": 1500 }[selected];
                break;

            case "Repas végétariens (par semaine) :":
                total += { "0–2": 200, "3–5": 400, "6–10": 700, "> 10": 1000 }[selected];
                break;

            // ----- HABILLEMENT ----- //
            case "T-shirts achetés par an :":
                total += { "0–1": 100, "2–4": 400, "5–7": 700, "8+": 1000 }[selected];
                break;

            case "Jeans ou vestes achetés par an :":
                total += { "0–1": 500, "1–2": 1000, "3–4": 2000, "5+": 3000 }[selected];
                break;

            // ----- SMARTPHONE ----- //
            case "Fréquence d’achat d’un nouveau smartphone :":
                total += { 
                    "Aucun (≥5 ans)": 0,
                    "Tous les 3–4 ans": 500,
                    "Tous les 2 ans": 900,
                    "Chaque année": 1800
                }[selected];
                break;
        }
    }

    console.log("💧 Consommation totale estimée :", total, "litres / semaine");
    return total;
}

