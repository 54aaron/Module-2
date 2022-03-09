#include <ArduinoJson.h>

void setup()
{
  Serial.begin(115200);
  delay(1000); // give me time to bring up serial monitor
  Serial.println("ESP32 Touch Test");
}

void loop()
{
 
  String message = "{";
  message = message + "\"Button\":" + digitalRead(15) + ", ";
  message = message + "\"Dial\":" + analogRead(12) + ", ";
  message = message + "\"vY\":" + analogRead(27) + ", ";
  message = message + "\"vX\":" + analogRead(26) + ", ";
  message = message + "\"SW\":" + analogRead(25)+ "}";

  delay(100);
  
  Serial.println(message);

}
