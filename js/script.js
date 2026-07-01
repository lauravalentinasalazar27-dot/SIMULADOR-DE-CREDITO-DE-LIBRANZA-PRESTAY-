//=======================================
// PROYECTO SENA
// SIMULADOR DE CRÉDITO DE LIBRANZA
//=======================================

const botonCalcular = document.getElementById("calcular");
const botonImprimir = document.getElementById("imprimir");
const botonPDF = document.getElementById("pdf");

let grafico = null;

botonCalcular.addEventListener("click", calcularCredito);

botonImprimir.addEventListener("click", () => {

    window.print();

});

botonPDF.addEventListener("click", descargarPDF);

//=======================================
// CALCULAR CRÉDITO
//=======================================

function calcularCredito(){

    const nombre = document.getElementById("nombre").value.trim();

    const monto = parseFloat(document.getElementById("monto").value);

    const plazo = parseInt(document.getElementById("plazo").value);

    const tasa = parseFloat(document.getElementById("interes").value)/100;

    if(nombre===""){

        alert("Ingrese su nombre.");

        return;

    }

    if(isNaN(monto) || monto<=0){

        alert("Ingrese un valor válido.");

        return;

    }

    if(isNaN(tasa) || tasa<=0){

        alert("Ingrese una tasa válida.");

        return;

    }

    // Fórmula de cuota fija

    const cuota = (monto*tasa)/(1-Math.pow((1+tasa),-plazo));

    let saldo = monto;

    let totalIntereses = 0;

    let tabla = "";

    let datosCapital = [];

    let datosInteres = [];

    for(let i=1;i<=plazo;i++){

        const interesMes = saldo*tasa;

        const capital = cuota-interesMes;

        saldo-=capital;

        totalIntereses+=interesMes;

        datosCapital.push(capital.toFixed(2));

        datosInteres.push(interesMes.toFixed(2));

        tabla+=`

        <tr>

            <td>${i}</td>

            <td>${formato(capital)}</td>

            <td>${formato(interesMes)}</td>

            <td>${formato(cuota)}</td>

        </tr>

        `;

    }

    document.getElementById("tablaAmortizacion").innerHTML = tabla;

    const total = cuota*plazo;

    document.getElementById("resultado").innerHTML=`

        <h3>

            Resultado de la Simulación

        </h3>

        <p>

            <strong>Cliente:</strong>

            ${nombre}

        </p>

        <p>

            <strong>Valor solicitado:</strong>

            ${formato(monto)}

        </p>

        <p>

            <strong>Cuota mensual:</strong>

            ${formato(cuota)}

        </p>

        <p>

            <strong>Total intereses:</strong>

            ${formato(totalIntereses)}

        </p>

        <p>

            <strong>Total a pagar:</strong>

            ${formato(total)}

        </p>

    `;

    crearGrafico(datosCapital,datosInteres);

}
//=======================================
// FORMATO MONEDA
//=======================================

function formato(valor){

    return valor.toLocaleString("es-CO",{

        style:"currency",

        currency:"COP",

        minimumFractionDigits:0

    });

}

//=======================================
// CREAR GRÁFICO
//=======================================

function crearGrafico(capital,interes){

    const ctx = document.getElementById("graficoCredito");

    if(grafico){

        grafico.destroy();

    }

    grafico = new Chart(ctx,{

        type:"line",

        data:{

            labels:capital.map((_,i)=>"Cuota "+(i+1)),

            datasets:[

                {

                    label:"Capital",

                    data:capital,

                    borderColor:"#003b7a",

                    backgroundColor:"rgba(0,59,122,.2)",

                    fill:true,

                    tension:.4

                },

                {

                    label:"Interés",

                    data:interes,

                    borderColor:"#e30613",

                    backgroundColor:"rgba(227,6,19,.2)",

                    fill:true,

                    tension:.4

                }

            ]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"top"

                }

            }

        }

    });

}

//=======================================
// DESCARGAR PDF
//=======================================

async function descargarPDF(){

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const nombre = document.getElementById("nombre").value || "No registrado";
    const monto = document.getElementById("monto").value || "0";
    const plazo = document.getElementById("plazo").value;
    const interes = document.getElementById("interes").value;

    pdf.setFontSize(18);
    pdf.text("SIMULADOR DE CRÉDITO DE LIBRANZA",20,20);

    pdf.setFontSize(12);

    pdf.text("Proyecto Académico SENA",20,35);

    pdf.text("Cliente: "+nombre,20,50);

    pdf.text("Valor solicitado: $"+Number(monto).toLocaleString("es-CO"),20,60);

    pdf.text("Plazo: "+plazo+" meses",20,70);

    pdf.text("Tasa mensual: "+interes+" %",20,80);

    pdf.text("------------------------------",20,90);

    const texto = document.getElementById("resultado").innerText;

    const lineas = pdf.splitTextToSize(texto,170);

    pdf.text(lineas,20,100);

    pdf.setFontSize(10);

    pdf.text("Este documento hace parte de un proyecto académico del SENA.",20,270);

    pdf.save("Simulacion_Credito.pdf");

}

//=======================================
// EFECTO SCROLL SUAVE
//=======================================

document.querySelectorAll("nav a").forEach(enlace=>{

    enlace.addEventListener("click",function(e){

        e.preventDefault();

        const destino=document.querySelector(this.getAttribute("href"));

        destino.scrollIntoView({

            behavior:"smooth"

        });

    });

});

//=======================================
// MENSAJE DE BIENVENIDA
//=======================================

window.addEventListener("load",()=>{

    console.log("Proyecto SENA cargado correctamente.");

});
