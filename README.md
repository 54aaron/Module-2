![an image of a eSP32 device running a program](https://github.com/54aaron/Module-1/blob/main/img/IMG_8338.jpg)
# PORTRAIT.

"Portrait" is an interactive computational art display.
Portrait is a rudimentary effort at attempting to link both the sonification and the visualization of user interaction with a device.
Users touch some buttons and turn some knobs with a remote control.
This in turn controls sounds, a gradient, and wiggles a drawing.
It's not rocket science.

# How It Works

In "Portrait" users can use a remote control to distort a lineart portrait of an individual - while also warping the sound being produced.
- The remote control consists of a button, a potentiometer, and a joystick. 
- The button starts and stops the sounds being produced. 
- The potentiometer can increase and decrease the BPM of the sound. It may also increase the speed at which the background gradient transistions. 
- The joystick can adjust pitch on a horizantal plane, and levels of distortion on a vertical plane. These planes also correspond to the directions the user can skew the portrait.

"Portrait" may be split between hardware and software.

On a hardware level, Portrait consists of a remote controller that in itself consists of an ESP32 microcontroller connected to the various aforementioned input components via soldering and a breadboard. The ESP32 runs an Arduino program (built on top of the Arduino IDE's "TouchRead" example code) that transmits information to Portrait's software via a serial connection over a USB-C cable.

On a software level, portrait operates on a Javascript program that receives information via JSON messages from a serial connection between it and the ESP32 microcontroller.
This software leverages three Javascript libraries (Tonejs, Animejs, and Granimjs) to visualuze and sonify user input. 
The software parses the JSON messages it receives for input component values and sonifies and visualzies them appropriately. 

Below are more specific instructions regarding the code featured in the repository, and also more specific installation instructions.

# Code
## ESP32
### Input Values
The ESP32 code is fairly simple. After the setup() function is able to establish a serial connection at a baud rate of 115200, the loop function then facilitates digitalRead() and analogRead() functions to read component input values. These values are interpolated into a string in JSON format - which is then printed to the serial connection after a delay of 100.

## Javascript
### Overview
In general, the Javascript program waits until a user clicks anywhere on the web broweser to establish a serial connection with the remote controller. Once a connection has been established, the readLoop() function will constantly read information provided by the ESP32 until the serial conenction has been broken. Worth considering, is increasing the buffersize of the opened port. I ran into an issue where receive JSON messages would be extremely fragmented and, as such, impossible to read. I theorized that this may have to do with the size of the Buffer reading the data from the serial connection and found that setting it to 2048 resulted in increased accuracy without sacrificing delayed response times. 

### Starting and Stopping
A set of "if" and "else if" statements are responsible for starting and stopping the sound and the ability to distort the image. The first if statements checks to see if the button sends a reading of 0 and if a global flag variable has a value of 0 - if so, then the program may begin. On the converse however, an "else if" statement follows that checks if the button sends a value of 0 and the global flag variable has a value of 1. This would imply that the program had already started which would then turn it "off."

### JSON
The ESP32 sends a JSON string to the Javascript program at a delay of 100. The incoming JSON message is then verified using helper function that checks to see if JSON.parse() is able to successfully parse the message or not. If verified, the message is then parsed into individual readings from the components on the remote - which is then used to determine sound and visual properties.

### Sound
As previously stated, the Javascript program leverages the Tonejs library to produce sound. The produced sounds are the result of a AMSynth, MonoSynth, and MembraneSynth all playing together. A looping beat is then created using the library's Loop method and the program waits until the user has pressed the button on the device to start this loop. 

#### BPM
Using a set of if statements, the javascript program constantly checks to see if the readings from the potentiometer are between certain values - which would determine the BPM of the generated sound. For example, one such if statement checks to see if the potentiometer is producing a reading between 3073 and 4096 (the highest range) and, if so, increases the BPM to 800. The Tonejs "rampTo" method is also leveraged to provide the impression of seamless BPM shifting.

#### Pitch and Distortion
Similar to the BPM, both Pitch and distortion employ sets of if statements that constantly check to see what range the vrX and vrY values of the joystick are between. They each facilitate Tonejs' Pitchshifter and Distorion shifters respectively.

#### Prototype - optional
Once everything had been more or less set up and connected I built a very rudimentary HTML prototype that allowed me to test the sound production functionality before adjusting it to reading constant input from the ESP32. Here's what that looked like:

![an image of a eSP32 device running a program](https://github.com/54aaron/Module-1/blob/main/img/IMG_8338.jpg)

### Drawing
The lineart portrait consists of an 500px x 600px SVG file made in Adobe Illustrator and exported via Inkscape.

#### Distortion
The Javascript program facilitates the animejs library to distort the SVG paths. This warping functions very similarly to the sound production. Using if statements, the program constantly checks to see if the vrX and vrY values from the joystick are between certain numbers - which would then correlate to the level and direction at which the image may be skewed. For example, pushing the joystick to the left results in a value between 2000 and 4096 - which results in the SVG being skewed 180 degrees to the left. The skewing is accomplished using animejs's "anime" function which targets an array of all of the paths in the SVG and influences them accordingly.

### Gradient
The gradient visualization is a result of the granimjs javascript library. It is held within a <canvas> HTML tag and placed behind the SVG file via providing it a lower z-index value in comparison to the SVG's z-index value. 
  
#### Transition speed 
Within the if statements responsible for adjusting the BPM, the program also adjusts the speed of the gradient transition using granim's changeState() method wherein each state corresponds to adifferent transition speed.
  
## Hardware
  
### Flashing your ESP32 Device
After you're done with your code, you'll use the Arduino IDE's upload function to flash your device with the program via a USB-C cable between your computer and your ESP32's USB-C port. 

### Connecting Components 
The output pins of each component were soldered to wires which were then connected to the ESP32 microcontroller via a breadboard.
The Button wires were connected to Ground and Pin 15; The potentiometer wires were connected to Ground, a 3.3v pin, and pin 12. The Joystick wires were connected to pins 27, 26, and 25, a ground pin, and a 3.3v pin. The wires were then "secured" to the breadboard using electrical tape.
  
![an image of a eSP32 device running a program](https://github.com/54aaron/Module-1/blob/main/img/IMG_8338.jpg)

### Encasing
After the circuit had been built and all the components connected - it was then encased in a box of sorts made from cardboard and hot glued together.
The breadboard had been secured to the bottom of this encasing using double sided tape. holes had been made on top of the box using an exacto knife (non-optimal)
and the various components were then pushed through and secured with either double sided tape, or a washer and a nut.
  
![a diagram for a paper envelop encasing](https://github.com/54aaron/Module-1/blob/main/img/Instagram%20post%20-%201.png)
  
The entire left side of this encasing had been left open as to allow ease of access to the ESP32's USB-C port:
  
![an image of a eSP32 device running a program](https://github.com/54aaron/Module-1/blob/main/img/IMG_8338.jpg)

If you're feeling especially creative - you could also decorate it with it stickers:
  
  ![an image of a eSP32 device running a program](https://github.com/54aaron/Module-1/blob/main/img/IMG_8338.jpg)
