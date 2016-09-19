# FinChartGen
## Génération de graphiques pour la finance
### Français (English follows)

Projet créé à la suite du cours de Finance II (FIN200) à l'UQAR.

Pour un travail pratique, on nous a demandé d'analyser 5 opportunités d'ivestissement pour une compagnie. Nous avons dû faire, à la suite de l'analyse, un graphique pour supporter nos résultats. Ce qui s'est révélé être un travail complexe par rapport aux informations nécessaires pour produire le graphique.

J'ai d'abord monté le graphique en d3js manuellement. Par la suite j'ai décidé de développer une interface pour générer le graphique.

Le premier générateur de garphique pour l'analyse d'opportunités d'investissement par rapport au coût est disponible ici:

www.faitque.tk/cmpc-tri

Le graphique prends en compte ces éléments pour la génération du graphique

Coût du capital avant et après la l'acquisition de nouveau capital (CMPC/WACC et CMC/MCC)
Capital disponible
Taux de rendement interne des projets (TRI/IOS)

Une fois ce générateur terminé je projette de continuer le projet avec différent calculateurs et générateurs de graphiques en lien avec les cours de finance.

### English

This is a project I started during a Finance class (FIN200) at my university (UQAR)

We had an exercice in which we needed to analyse 5 investment opportunities for a company. After the analysis we had to do a chart to support our results. It was a lot harder to do than I initially thought because of all the information that needs to be included.

I initialy did the graph manually with d3js but then I decided to create a chart generator that I could share to hopefuly help those that are looking for a solution for drawing this type of chart.

The first chart generator I build is available here:

www.faitque.tk/mcc-ios

The tool uses these informations to draw the chart:

Cost of capital before and after financing (WACC and MCC)
Capital available
Investment Opportunity schedule (IOS)