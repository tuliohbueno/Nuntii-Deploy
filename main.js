////////////////////////////////////////////////////////////////////////////
// Anotações:
// 
// exemplo de estrutura da notícia:
// <li>
//     <h3 class="tituloNoticia">OPA</h3>
//     <img class="img-noticia" src="" srcset="">
//     <p class="resumo-noticia">opa</p>
//     <a class="url-noticia"></a>
// </li>
//
////////////////////////////////////////////////////////////////////////////

// constantes
const apiURL = 'http://unitti-tcc.herokuapp.com/noticias';

// funções
function criaNoticia(titulo, img, resumo, url) {
    const noticia = document.createElement('li');

    const tituloNoticia = document.createElement('h3');
    tituloNoticia.classList.add('titulo-noticia');
    tituloNoticia.innerText = titulo;

    const imgNoticia = document.createElement('img');
    imgNoticia.classList.add('img-noticia');
    imgNoticia.setAttribute('src', img);

    const resumoNoticia = document.createElement('p');
    resumoNoticia.classList.add('resumo-noticia');
    resumoNoticia.innerText = resumo

    const urlNoticia = document.createElement('a');
    urlNoticia.classList.add('url-noticia');
    urlNoticia.innerText = url
    urlNoticia.setAttribute('href', url);

    noticia.append(tituloNoticia);
    noticia.append(imgNoticia);
    noticia.append(resumoNoticia);
    noticia.append(urlNoticia);
    return noticia;
}

function limpaFeed() {
    const feedNoticias = document.getElementById('noticias');
    while (feedNoticias.lastChild) {
        feedNoticias.removeChild(feedNoticias.lastChild);
    }
}

function adicionaNoticia(noticia) {
    const feedNoticias = document.getElementById('noticias');
    feedNoticias.append(noticia)
}

function montaPesquisa(termo) {
    const url = `${apiURL}?termo=${termo}`;
    return url;
}

function pesquisa(termo) {
    fetch(montaPesquisa(termo))
        .then(response => response.json())
        .then(noticias => {
            limpaFeed();

            noticias.forEach(item => {
                const { titulo, urlNoticia, urlImagem, conteudo } = item;
                const noticia = criaNoticia(titulo, urlImagem, conteudo, urlNoticia);
                adicionaNoticia(noticia);
            });

            const data = new Date()

            // [-7d, -15d, -30d]
            const datas = [
                data.setDate(data.getDate() - 7) && data.toISOString().split('T')[0], //-7d
                data.setDate(data.getDate() - 8) && data.toISOString().split('T')[0], //-15d
                data.setDate(data.getDate() - 15) && data.toISOString().split('T')[0] //-30d
            ];

            const acumulador = {
                negativas: [0, 0, 0],
                positivas: [0, 0, 0],
                neutras: [0, 0, 0]
            };

            for (let index = 0; index < datas.length; index++) {
                noticias.forEach(noticia => {
                    const dataNoticia = data.toISOString().split('T')[0]
                    if (dataNoticia > datas[index]) {
                        if (noticia.analise > 0) {
                            acumulador.positivas[index] += 1;
                        } else if (noticia.analise < 0) {
                            acumulador.negativas[index] += 1;
                        } else {
                            acumulador.neutras[index] += 1;
                        }
                    }
                });
            }

            criaGrafico(acumulador);

        });
}

// 0 por padrão para criar o gráfico zerado
function criaGrafico(noticias = { positivas: 0, negativas: 0, neutras: 0 }) {
    console.log(noticias)
    let ctx = document.getElementsByClassName("line-chart");
    const chartGraph = new Chart(ctx,
        {
            type: 'line',
            data: {
                labels: ["7d", "15d", "30d"],

                datasets: [
                    {
                        label: "Positivas",
                        data: noticias.positivas,
                        borderWidth: 5,
                        borderColor: 'rgba(60,179,113)',
                        backgroundColor: 'transparent',
                    },

                    {
                        label: "Neutro",
                        data: noticias.neutras,
                        borderWidth: 5,
                        borderColor: 'rgba(15,40,110)',
                        backgroundColor: 'transparent',
                    },


                    {
                        label: "Negativas",
                        data: noticias.negativas,
                        borderWidth: 5,
                        borderColor: 'rgba(139,0,0)',
                        backgroundColor: 'transparent',
                    },
                ]
            },

            options: {
                title: {
                    display: true,
                    fontSize: 20,
                    text: "Filtro"

                },
                labels: {
                    fontStyle: "bold"
                },
            }

        });
}