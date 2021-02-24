async function getEvents() {
  let events;
  await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json"
  )
    .then((res) => res.json())
    .then((data) => (events = data))
    .then(() => console.log(events));

  let bodyEvents = document.getElementById("bodyEvents");
  //Crea un diccionario para agregar los TN, FN, FP, TP para cada evento individual
  let dict = {};

  //Crea la tabla con los eventos, e inicializa el diccionario
  for (let index = 0; index < events.length; index++) {
    const element = events[index];
    let row = document.createElement("tr");
    let numero = document.createElement("td");
    numero.scope = "row";
    numero.innerHTML = index + 1;
    row.appendChild(numero);
    let eventsRow = "";
    element.events.forEach((eventoI) => {
      eventsRow = eventsRow + eventoI;
      eventsRow = eventsRow + ", ";
      if (dict[eventoI] === undefined) {
        //Crea un arreglo por cada elemento con su TN, FN, FP, TP
        dict[eventoI] = [0, 0, 0, 0];
      }
    });
    let eventsData = document.createElement("td");
    eventsData.innerHTML = eventsRow;
    row.appendChild(eventsData);
    let squirrelData = document.createElement("td");
    squirrelData.innerHTML = "" + element.squirrel;
    row.appendChild(squirrelData);
    if (element.squirrel) {
      row.className = "table-danger";
    }
    bodyEvents.appendChild(row);
  }

  //Agrega los TN, FN, FP, TP a cada elemento individual
  for (let index = 0; index < events.length; index++) {
    const element = events[index];
    for (const key in dict) {
      if (Object.hasOwnProperty.call(dict, key)) {
        const eventoIndividual = dict[key];
        if (element.squirrel == false && !element.events.includes(key)) {
          eventoIndividual[0] += 1;
        } else if (element.squirrel == false && element.events.includes(key)) {
          eventoIndividual[1] += 1;
        } else if (element.squirrel == true && !element.events.includes(key)) {
          eventoIndividual[2] += 1;
        } else if (element.squirrel == true && element.events.includes(key)) {
          eventoIndividual[3] += 1;
        }
      }
    }
  }
  //Diccionario con las correlaciones de cada evento
  let correlations = {};
  //Calcula las correlaciones de cada evento
  for (const key in dict) {
    if (Object.hasOwnProperty.call(dict, key)) {
      const element = dict[key];
      let tn = element[0];
      let fn = element[1];
      let fp = element[2];
      let tp = element[3];
      correlations[key] =
        (tp * tn - fp * fn) /
        Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
    }
  }

  //Ordena el objeto
  function sortObject(obj) {
    items = Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    sorted_obj = {};
    $.each(items, function (k, v) {
      use_key = v[0];
      use_value = v[1];
      sorted_obj[use_key] = use_value;
    });
    return sorted_obj;
  }

  let correlationsSorted = sortObject(correlations);

  //Muestra las correlaciones en el documento
  let bodyCorrelations = document.getElementById("bodyCorrelations");
  let i = 1;
  for (const key in correlationsSorted) {
      if (Object.hasOwnProperty.call(correlationsSorted, key)) {
          const element = correlationsSorted[key];
          let row = document.createElement("tr");
          let numero = document.createElement("td");
          numero.innerHTML = i;
          row.appendChild(numero);
          let evento = document.createElement("td");
          evento.innerHTML = key;
          row.appendChild(evento);
          let correlacion = document.createElement("td");
          correlacion.innerHTML = element;
          row.appendChild(correlacion);
          bodyCorrelations.appendChild(row);
          i++;
      }
  }

  

  console.log(dict);
}

getEvents();
