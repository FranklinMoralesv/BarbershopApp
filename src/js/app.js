let page=1;

const reservation = {
    name: '',
    date: '',
    hour: '',
    services: []
}


document.addEventListener('DOMContentLoaded',()=>{

    startApp();
    //console.log(page);
});

function startApp(){
    showServices();
    changeSection();
    nextPage();
    previousPage();
    pagingButtons();

    disablePreviousDay();
    formName();
    formDate();
    formHour();

    showSummary();

}

async function showServices(){

    try {
        const result=await fetch('./services.json');
        const db = await result.json();

        const { services } = db;

       // Generar el HTML
       services.forEach( service => {
            const { id, name, price } = service;

            // DOM Scripting
            // Generar nombre de servicio
            const serviceName = document.createElement('P');
            serviceName.textContent = name;
            serviceName.classList.add('service-name');

            // Generar el precio del servicio
            const servicePrice = document.createElement('P');
            servicePrice.textContent = `$ ${price}`;
            servicePrice.classList.add('service-price');

            // Generar div contenedor de servicio
            const divService = document.createElement('DIV');
            divService.classList.add('service');
            divService.dataset.idService = id;

            // Selecciona un servicio para la cita
            divService.onclick = selectService;


            // Inyectar precio y nombre al div de servicio
            divService.appendChild(serviceName);
            divService.appendChild(servicePrice);

            // Inyectarlo en el HTML
            document.querySelector('#services').appendChild(divService);
       } );
       
    } catch (error) {
        console.log(error);
    }
}

function selectService(e) {
    
    let element;
    // Forzar que el  elemento al cual le damos click sea el DIV 
    if(e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;
    }

    if(element.classList.contains('selected')) {
        element.classList.remove('selected');

        const id = parseInt( element.dataset.idService );

        deleteService(id);
    } else {
        element.classList.add('selected');

        const serviceObj = {
            id: parseInt( element.dataset.idService ),
            name: element.firstElementChild.textContent,
            price: element.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj);
        addService(serviceObj);
    }
}

function changeSection() {
    const links = document.querySelectorAll('.tabs button');

    links.forEach( link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.step);

            showSection();
            
            pagingButtons();
        });
    });
}

function showSection() {

    // Eliminar mostrar-seccion de la sección anterior
    const previousSection = document.querySelector('.show-section');
    if( previousSection ) {
        previousSection.classList.remove('show-section');
    }

    const currentSection = document.querySelector(`#step-${page}`);
    currentSection.classList.add('show-section');

    // Eliminar la clase de actual en el tab anterior
    const previousTab = document.querySelector('.tabs .current');
    if(previousTab) {
        previousTab.classList.remove('current');
    }
   
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-step="${page}"]`);
    tab.classList.add('current');
}

function nextPage() {
    const next = document.querySelector('#next');

    next.addEventListener('click', () => {
        page++;
        pagingButtons();
        //console.log(page);
    });
}

function previousPage() {
    const previous = document.querySelector('#previous');
    previous.addEventListener('click', () => {
        page--;

        pagingButtons();
        //console.log(page);
    });
}

function pagingButtons() {
    const nextPage = document.querySelector('#next'); //Para ocultar botones
    const previousPage = document.querySelector('#previous');

    
    if(page  === 1) {
        previousPage.classList.add('hide');
    } else if (page === 3) {
        nextPage.classList.add('hide');
        previousPage.classList.remove('hide');

       showSummary(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        previousPage.classList.remove('hide');
        nextPage.classList.remove('hide');
    }

    showSection(); // Cambia la sección que se muestra por la de la página
}

function showSummary() {
    // Destructuring
    const {name, date, hour, services } = reservation;

    // Seleccionar el resumen
    const divSummary = document.querySelector('.summary-content');

    // Limpia el HTML previo
    while( divSummary.firstChild ) {
        divSummary.removeChild( divSummary.firstChild );
    }

    // validación de objeto
    if(Object.values(reservation).includes('')) {
        const noServices = document.createElement('P');
        noServices.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServices.classList.add('invalidate');

        
        divSummary.appendChild(noServices);

        return;
    }

    const reservationTitle = document.createElement('H3');
    reservationTitle.textContent = 'Resumen de Cita';

    // Mostrar el resumen
    const servicesElement = document.createElement('DIV');
    servicesElement.classList.add('summary-content');

    const nameElement = document.createElement('P');
    nameElement.innerHTML = `<span>Nombre:</span> ${name}`;

    const dateElement = document.createElement('P');
    dateElement.innerHTML = `<span>Fecha:</span> ${date}`;

    const hourElement = document.createElement('P');
    hourElement.innerHTML = `<span>Hora:</span> ${hour}`;

    const servicesTitle = document.createElement('H3');
    servicesTitle.textContent = 'Resumen de Servicios';

    servicesElement.appendChild(servicesTitle);

    let totalamount = 0;

    // Iterar sobre el arreglo de servicios
    services.forEach( service => {

        const {name, price } = service;
        const serviceContainerElement = document.createElement('DIV');
        serviceContainerElement.classList.add('summary-service');

        const textService = document.createElement('P');
        textService.textContent = name;

        const priceElement = document.createElement('P');
        priceElement.textContent = price;
        priceElement.classList.add('price');

        const amount = price.split('$');
        // console.log(parseInt( totalServicio[1].trim() ));

        totalamount += parseInt( amount[1].trim());

        // Colocar texto y precio en el div
        serviceContainerElement.appendChild(textService);
        serviceContainerElement.appendChild(priceElement);

        servicesElement.appendChild(serviceContainerElement);

    } );


    divSummary.appendChild(reservationTitle);
    divSummary.appendChild(nameElement);
    divSummary.appendChild(dateElement);
    divSummary.appendChild(hourElement);
    divSummary.appendChild(servicesElement);

    const totalAmountElement = document.createElement('P');
    totalAmountElement.classList.add('total');
    totalAmountElement.innerHTML = `<span>Total a Pagar:  </span> $ ${totalamount}`;


    divSummary.appendChild(totalAmountElement);

}

function deleteService(id) {
    const { services } = reservation;
    //filter itera sobre los servicios y regresa solo los que cumplan la condicion
    reservation.services = services.filter( service => service.id !== id );
 
   // console.log(reservation);
 }
 
 function addService(serviceObj) {
     const {services } = reservation;
     reservation.services = [...services, serviceObj];
 
     console.log(reservation);
 }

function formName() {
    const inputNameElement = document.querySelector('#name');

    inputNameElement.addEventListener('input', e => {
        const textName = e.target.value.trim();

        // Validación de que nombreTexto debe tener algo
        if( textName === '' || textName.length < 3 ) {
            showAlert('Nombre no valido', 'error')
        } else {
            const alert = document.querySelector('.alert');
            if(alert) {
                alert.remove();
            }
            //Si pasa la validacion se le guarda el nombre
            reservation.name = textName;
        }
    });
}

function formDate() {
    const inputDateElement = document.querySelector('#date');
    inputDateElement.addEventListener('input', e => {

        const day = new Date(e.target.value).getUTCDay();
        
        if([0].includes(day)) {
            e.preventDefault();
            inputDateElement.value = '';
            showAlert('Los Domingos no estan permitidos', 'error');
        } else {
            reservation.date = inputDateElement.value;

           
        }
    })
}

function formHour() {
    
    const inputHourElement = document.querySelector('#hour');
    inputHourElement.addEventListener('input', e => {

        const hour = e.target.value;
       // const hourFormat = hour.split(':');
        /* TODO:Validar hora
            if(hourFormat[0] < 9 || hourFormat[0] > 18 ) {
                
                setTimeout(() => {
                    showAlert('Hora no válida', 'error');
                    inputHourElement.value = '';
                }, 1000);
            } else {
            }
        */
            reservation.hour = hour;
        
    });
}

function disablePreviousDay() {
    const inputDateElement = document.querySelector('#date');
   // console.log(inputDateElement);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;//por que comienza desde el cero
    const day = currentDate.getDate() + 1;
    //const dateToDisable = `${year}-${month}-${day}`;

    const dateToDisable = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
       
    /*
    if(month < 10) {
             month = `0${month}`
         }
     if(day < 10) {
             day = `0${day}`
         }

     */
    inputDateElement.min = dateToDisable;
}

function showAlert(message, type) {

    // Si hay una alerta previa, entonces no crear otra
    const previousAlert = document.querySelector('.alert');
    if(previousAlert) {
        return;
    }

    const alert = document.createElement('DIV');
    alert.textContent = message;
    alert.classList.add('alert');

    if(type === 'error') {
        alert.classList.add('error');
    }

    // Insertar en el HTML
    const form = document.querySelector('.form');
    form.appendChild( alert );

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
