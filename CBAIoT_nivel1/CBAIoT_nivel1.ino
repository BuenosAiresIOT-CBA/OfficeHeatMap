#include "DHT.h"
#define DHTPIN 8     // A que pin esta conectado?

// Descomentar segun cual esten usando!
#define DHTTYPE DHT11   // DHT 11 
//#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Inicializar DHT normal para Arduino de 16mhz
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600); 
  Serial.println("DHT test!");
 
  dht.begin();
}

void loop() {
    // Espero 2 segundos
    delay(2000);

    // Leer la temperatura o la humedad puede tardar hasta 250 milisegundos!
    // DHT puede ofrecer datos 2 segundos de antiguedad. Ojo.
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    
    //Se puede utilizar esta para obtener la temperatura en Fahrenheit.
    // float f = dht.readTemperature(true);
  
    //isnan devuelve "1" si el parametro recibido no es un numero.
    // Si falla, reinicia el main loop (y vuelve a intentar).
      if (isnan(h) || isnan(t)) {
        Serial.println("Fallo el DHT!");
        return;
      }

      Serial.print("Humedad: "); 
      Serial.print(h);
      Serial.println(" %\t");
      Serial.print("Temperatura: "); 
      Serial.print(t);
      Serial.println(" C ");
}
