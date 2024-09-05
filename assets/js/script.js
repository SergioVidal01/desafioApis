$(document).ready(function() {
    $("#heroSearchForm").submit(function(event) {
        event.preventDefault();
        let heroId = $("#heroId").val().trim();
        //aquí validamos el envío del formulario

        // Validar que solo se ingresen números
        if (!/^\d+$/.test(heroId)) {
            alert("Por favor, ingrese solo números.");
            return;
        }

        // solicitud AJAX a la API
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
// aquí hicimos la tarjeta con la imagen del heroe y las caracteristicas que se pedían en el desafío con una funcion.

function renderHeroInfo(data) {
    if (data && data.image && data.image.url) {
        let heroCard = `
            <div class="card" style="width: 100%;">
                <div class="row g-0 d-flex align-items">
                    <!-- Imagen del héroe -->
                    <div class="col-md-4">
                        <img src="${data.image.url}" class="img-fluid rounded-start" alt="${data.name}">
                    </div>
                    <!-- Información del héroe -->
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.name}</h5>
                            <p class="card-text"><strong>Nombre Completo:</strong> ${data.biography['full-name'] || 'No disponible'}</p>
                            <p class="card-text"><strong>Alias:</strong> ${data.biography.aliases.join(', ') || 'No disponible'}</p>
                            <p class="card-text"><strong>Primera aparición:</strong> ${data.biography['first-appearance'] || 'No disponible'}</p>
                            <p class="card-text"><strong>Ocupación:</strong> ${data.work.occupation || 'No disponible'}</p>
                            <p class="card-text"><strong>Base de operaciones:</strong> ${data.work.base || 'No disponible'}</p> 
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#heroInfo").html(heroCard);
    } else {
        $("#heroInfo").html("<p>No se pudo cargar la información del héroe.</p>");
    }
}
// se crea una función para recopilar las estadisticas del heroe
function renderHeroChart(data) {
    let chartData = [
        { y: data.powerstats.intelligence, label: "Inteligencia" },
        { y: data.powerstats.strength, label: "Fuerza" },
        { y: data.powerstats.speed, label: "Velocidad" },
        { y: data.powerstats.durability, label: "Durabilidad" },
        { y: data.powerstats.power, label: "Poder" },
        { y: data.powerstats.combat, label: "Combate" }
    ];
//se muestra el gráfico usando CanvasJS
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