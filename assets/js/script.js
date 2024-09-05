$(document).ready(function() {
    $("#heroSearchForm").submit(function(event) {
        event.preventDefault();
        let heroId = $("#heroId").val().trim();

        // Validar que solo se ingresen números
        if (!/^\d+$/.test(heroId)) {
            alert("Por favor, ingrese solo números.");
            return;
        }

        // Hacer la solicitud AJAX a la API
        $.ajax({
            url: `https://www.superheroapi.com/api.php/4905856019427443/${heroId}`,
            method: 'GET',
            success: function(data) {
                console.log(data);  // Verifica los datos en la consola
                renderHeroInfo(data);
                renderHeroChart(data);
            },
            error: function() {
                alert("Hubo un error al realizar la búsqueda. Intente de nuevo.");
            }
        });
    });
});

function renderHeroInfo(data) {
    if (data && data.image && data.image.url) {
        let heroCard = `
            <div class="card" style="width: 100%;">
                <img src="${data.image.url}" class="card-img-top" alt="${data.name}">
                <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">Ocupación: ${data.work.occupation}</p>
                    <p class="card-text">Primera aparición: ${data.biography['first-appearance']}</p>
                </div>
            </div>
        `;
        $("#heroInfo").html(heroCard);
    } else {
        $("#heroInfo").html("<p>No se pudo cargar la información del héroe.</p>");
    }
}

function renderHeroChart(data) {
    let chartData = [
        { y: data.powerstats.intelligence, label: "Inteligencia" },
        { y: data.powerstats.strength, label: "Fuerza" },
        { y: data.powerstats.speed, label: "Velocidad" },
        { y: data.powerstats.durability, label: "Durabilidad" },
        { y: data.powerstats.power, label: "Poder" },
        { y: data.powerstats.combat, label: "Combate" }
    ];

    var chart = new CanvasJS.Chart("heroChart", {
        animationEnabled: true,
        title: {
            text: `${data.name} - Estadísticas de poder`
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: chartData
        }]
    });
    chart.render();
}