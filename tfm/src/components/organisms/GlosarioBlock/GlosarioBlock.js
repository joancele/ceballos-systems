// GlosarioBlock client-side logic
document.addEventListener('DOMContentLoaded', () => {
  const glosarioLinks = document.querySelectorAll('.glosario-link');

  const definitions = {
    'glosario-actuacion-potencia': {
      title: 'Actuación de Potencia',
      desc: 'Dispositivo o circuito que permite a un microcontrolador de baja potencia (como Arduino, que opera a 5V) controlar cargas eléctricas de alta tensión o corriente (como motores o tiras LED de 12V) de forma segura, aislando ambas etapas eléctricas.'
    },
    'glosario-algoritmo': {
      title: 'Algoritmo',
      desc: 'Secuencia ordenada, finita y lógica de instrucciones o pasos matemáticos que el microcontrolador del biodomo ejecuta de forma cíclica para resolver un problema (por ejemplo, decidir cuándo activar el riego basándose en los datos de los sensores).'
    },
    'glosario-arduinoblocks': {
      title: 'ArduinoBlocks',
      desc: 'Entorno de programación visual optimizado para educación que traduce una estructura de bloques gráficos modulares (tipo puzle) a código fuente puro en C++, facilitando el aprendizaje de la lógica algorítmica sin la barrera de la sintaxis del código escrito.'
    },
    'glosario-depuracion': {
      title: 'Depuración (Debugging)',
      desc: 'Proceso sistemático de identificar, aislar y corregir errores lógicos o de sintaxis (bugs) en el software o fallos de conexión en el hardware. En esta SA, se aborda bajo la "cultura del error" como una herramienta activa de aprendizaje y resiliencia.'
    },
    'glosario-pwm': {
      title: 'Modulación por Ancho de Pulsos (PWM)',
      desc: 'Técnica digital que consiste en modificar los ciclos de encendido y apagado de una señal cuadrada a una frecuencia muy alta. Permite simular una señal analógica variable desde un pin digital de Arduino, ideal para regular la intensidad lumínica del amanecer/atardecer marciano mediante el MOSFET.'
    },
    'glosario-mosfet': {
      title: 'MOSFET (IRF520)',
      desc: 'Transistor de efecto de campo que actúa como un interruptor electrónico de alta velocidad. A diferencia de un relé mecánico, soporta conmutaciones rápidas (PWM), lo que permite regular de forma progresiva la potencia entregada a la tira LED de cultivo.'
    },
    'glosario-monitor-serie': {
      title: 'Monitor Serie',
      desc: 'Canal de comunicación asíncrona que conecta la placa Arduino con el ordenador a través del puerto USB. Permite al programador visualizar en tiempo real en la pantalla las lecturas de los sensores o el estado interno de las variables del algoritmo para tareas de depuración.'
    },
    'glosario-rele': {
      title: 'Relé (Módulo de 1 Canal)',
      desc: 'Interruptor electromecánico que se activa mediante una pequeña señal digital de 5V procedente de Arduino. Al activarse, cierra físicamente un circuito independiente de 12V, permitiendo el paso de corriente hacia la bomba peristáltica.'
    },
    'glosario-sensor-analogico': {
      title: 'Sensor Analógico',
      desc: 'Dispositivo de entrada que transforma una magnitud física del entorno (como la humedad del suelo o la intensidad de la luz) en una señal eléctrica continua que toma valores en un rango determinado. Arduino traduce esta señal en un espectro digital de 0 a 1023.'
    },
    'glosario-sensor-capacitivo': {
      title: 'Sensor Capacitivo',
      desc: 'Dispositivo que mide la humedad del entorno midiendo los cambios en la capacitancia eléctrica (capacidad de almacenar carga) en lugar de la resistencia. Al no exponer contactos metálicos directos al agua, es inmune a la corrosión, garantizando la estabilidad a largo plazo en sistemas de hidroponía.'
    },
    'glosario-pin-analogico': {
      title: 'Pin Analógico',
      desc: 'Conexión de la placa que puede leer un rango de valores (ej. de 0 a 1023), ideal para medir la cantidad exacta de luz o agua.'
    },
    'glosario-actuador': {
      title: 'Actuador',
      desc: 'Componente que realiza una acción física en el mundo real, como moverse (motor) o iluminar (LED).'
    },
    'glosario-condicional': {
      title: 'Condicional (SI/SINO)',
      desc: 'Instrucción lógica. "SI ocurre esto (tierra seca), haz esto (encender bomba). SINO, no hagas nada".'
    },
    'glosario-bucle': {
      title: 'Bucle (Loop)',
      desc: 'Parte del código que el Arduino repite infinitamente sin detenerse nunca.'
    }
  };

  glosarioLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = link.getAttribute('href').replace('#', '');
      const data = definitions[hash];
      if (data) {
        // Dispatch custom event to notify the dashboard/drawer
        document.dispatchEvent(new CustomEvent('open-glosario-drawer', {
          detail: { hash, title: data.title, desc: data.desc }
        }));
        
        // Focus/highlight the card in Bloque 4
        const card = document.getElementById(`glosario-card-${hash.replace('glosario-', '')}`);
        if (card) {
          document.querySelectorAll('.glosario-card').forEach(c => c.style.borderColor = '');
          card.style.borderColor = '#a855f7';
        }
      }
    });
  });
});
