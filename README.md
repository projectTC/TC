# myProject TClone
Hi there! 👋
I tried to develop a Real Time Video Calling web application built using the following tech stack:

- Django  <img src="https://alternative.me/media/256/django-icon-2jqi6c39eg9fnfmv-c.png" width=20px height=20px align=center>
- Python <img src="https://tse3.mm.bing.net/th?id=OIP.CYpqc79M1jl94xw__TzDiQHaHa&pid=Api&P=0&w=300&h=300" width=20px height=20px align=center>
- HTML <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/800px-HTML5_logo_and_wordmark.svg.png" width=20px height=20px align=center>
- CSS <img src="https://3.bp.blogspot.com/-oRSUw_TmO9o/XIb61m88fcI/AAAAAAAAIq0/vnxl2zzsXEQsnHI2fH4GjKu_ZT0urRo4wCK4BGAYYCw/s1600/icon%2Bcss%2B3.png" width=15px height=20px align=center>
- JavaScript <img src="https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png" width=20px height=20px align=center>
- WEBRTC(for p2p communication) <img src="https://styles.redditmedia.com/t5_2unw6/styles/communityIcon_3qc66h3yt5u01.png" width=25px height=25px align=center>
- WebKit Speech Recognition in Javascript(for speech recognition) <img src="https://tse2.mm.bing.net/th?id=OIP.EOx8l0t1OjD-kFXG-skywQAAAA&pid=Api&P=0&w=300&h=300" width=20px height=20px align=center>

Since this project is still under deployment, you have to follow these steps to run your setup on localhost:

- Clone this repository from github.
- Locate to the project folder(i.e. TeamsCloneProject here)
- Install a virtual environment using **Command Prompt**(or from terminal of any IDE) by running **pip install virtualenv**

![image](https://user-images.githubusercontent.com/85979410/125254202-df988600-e317-11eb-870f-10ea117024b3.png)

- Create a virtual environment in root folder by running **virtualenv  <name_of_virtual_env_that_you_want_to_create>** and activate it by running **<name_of_venv>\Scripts\activate**

![image](https://user-images.githubusercontent.com/85979410/125254801-706f6180-e318-11eb-868d-2de7fe68dbdc.png)

- Install django and django-channels on this virtual env by running **pip install django** and **pip install django-channels**

![image](https://user-images.githubusercontent.com/85979410/125255215-d2c86200-e318-11eb-983a-50887b3107e4.png)

**NOTE: You can also create requirements.txt file and run it by pip install -r requirements.txt**

- Run all migrations by using **py manage.py migrate**

![image](https://user-images.githubusercontent.com/85979410/125255508-233fbf80-e319-11eb-8d4e-d654291a5638.png)

- Collect all static images, css and js files using **py manage.py collectstatic**

![image](https://user-images.githubusercontent.com/85979410/125255621-41a5bb00-e319-11eb-9ca9-364d55a59371.png)

- Now, to run the main application use **py manage.py runserver**

![image](https://user-images.githubusercontent.com/85979410/125255726-5b470280-e319-11eb-83b3-375a1ab66a8c.png)

Copy the given localhost URL, i.e. http://127.0.0.1:8000/ to view the application.

Hurray!! There you go! 🥳


**AGILE Methodologies used:**

Scrum methodology has been used throughout where in tasks were divided into sprints of four weeks to produce deliverables.
Tasks for development of this application have been majorly divided into the following:
 1. Sprint 1 consisted of developing basic peer to peer communication. Faced issues, but resolved.
 2. Sprint 2 consisted of addition of chat feature between users. That being done, screen sharing option was the next deliverable.
 3. Sprint 3 was to complete screen sharing and develop voice assistant feature. Both had few bugs, that were resolved with some research.
 4. Sprint 4 focused on addition of working voice assistant, emoji feature and calendar to application. 
All this while, codes were pushed onto GitHub and deployment started, although it was not successful.

![image](https://user-images.githubusercontent.com/85979410/125310609-5f424700-e350-11eb-8164-e4649fb2c45a.png)


**Be smart...Be Agile...** 😄
