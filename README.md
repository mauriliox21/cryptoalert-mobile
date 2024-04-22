# cryptoalert
Front-end mobile do meu projeto cryptoalert


### Tecnologias e Ferramentas
- React Native
- Typescript
- Axios
- yup
- React Hook Form
- React Navigation

### Objetivo da Aplicação
Um usuário se cadastra e posteriormente cadastra os alertas que deseja receber em seu dispositivo móvel, onde um alerta é basicamente uma notificação push que ele irá receber quando o valor estipulado em seu alerta for atingido. Já sobre os alertas, cada usuário pode cadastrar no máximo 6 alertas, um alerta tem informações sobre o "valor alvo" ou seja o valor que a criptomoeda deve atingir, o "tipo do alerta" para dizer se o valor será atingido quando a criptomoeda tiver um aumento em seu valor ou uma queda em seu valor e por fim o alerta também tem a informação sobre qual criptomoeda é aquele alerta.
A API também permite que sejam cadastrados dispositivos para o usuário, estes dispositivos cadastrados para que o usuário possa receber o alerta que é basicamente uma notificação push. 
Além disso, esta API também permite que sejam cadastradas outras criptomoedas por um usuário "admin" e assim ficam disponíveis novas criptomoedas para criar alertas.

### Como funciona
Primeiramente um usuário se auto cadastra (com nome, e-mail e senha), após cadastrado no sistema o usuário deve se autenticar para continuar usando as funcionalidades, esta autenticação é feita usando o e-mail e a senha, após autenticado o sistema fornece ao usuário um token JWT para ser usado nas requisições, para criar, alterar, consultar e deletar seus alertas. Todas as informações são salvas em um banco de dados Postgres, periodicamente a um “Job” que que consulta a API da [CoinMarketCap](https://coinmarketcap.com) e verifica quais alertas foram atingidos. No caso dos alertas atingidos, o sistema usa a API do Firebase Cloud Messaging para enviar as notificações para os dispositivos cadastrados para os usuários proprietários dos alertas atingidos.

### Como Executar
- Deve ter o node na versão 18.15.0 ou superior
- Necessário executar o [back-end do progeto](https://github.com/mauriliox21/cryptoalert), para poder executar as operações corretamente.
- Executar os seguintes comandos:
    - npm install
    - npx expo start
Em caso de ser executado usando o expo não é possível testar o recebimento de notificações, caso queira um teste completo use o comando ```npx expo run:android``` no lugar do comando ```npx expo start```, Este comando irá gerar uma compilação local com os recursos nativos.
