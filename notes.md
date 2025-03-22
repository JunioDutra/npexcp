entidades:
- match
    - id int
    - 
- player

- weapon (enum?)

features
- upload de arquivo de log no nestjs
- criar view
    - ranking 
    - estatisticas dos jogadores
    - dados das partidas
- Ranking por partida com K/D
    - arma preferida do vencedor
    - identificar maior sequencia de de kills sem morrer
    - jogadores que vecerem uma partida sem morrer deve receber um "award"
    - jogadores que matarem 5 vezes em 1 minuto devem receber um award
    - permitir times,  quando tiver fogo amigo, deve dar -1 no score (kills)
- Ranking global dos jogadores computando dados de todas as partidas
- rodada = partida?
    - receber 1/n logs de rodadas/partidas em um unico upload
- parsing de logs
    - ignorar kills de WORLD, mas contas as mortes pra quem morreu
    - uma rodada / partida por der multiplos jogadores, mas no maximo 20 por partida.

    USar Muita OO
    Solid, usecases, services, interactors, etc...
    testes unitarios, e tentar tdd
    comits atomicos e progressivos
    fazer com nest
