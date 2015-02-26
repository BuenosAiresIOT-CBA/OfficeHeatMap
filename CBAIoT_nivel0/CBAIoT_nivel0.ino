void setup() {
  Serial.begin(9600); 
  Serial.println("El bloque setup se ejecuta una unica vez.");
}

void loop() {
  // Espero 2 segundos
  delay(2000);

  Serial.println("Hola Arduino! El bloque loop es ejecutado continuamente.");
}
