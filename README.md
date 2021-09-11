# react_spring_boot_war_file
Create a war file that serves a react app as a frontend

## Starting the app

From within eclipse run/debug the method:

```
com.wb.digitalgarden.DigitalgardenApplication.main(String[])
```

In the console, spring security will output a randomly generated password for the user called 'user'.

```
Using generated security password: c0f09752-6de6-4a00-97b8-bcdb72c153f4
```

Visit:

http://localhost:8080/login

Login with the generated password and the username 'user'.

## Creating this app

Heavily inspired by: https://medium.com/analytics-vidhya/how-to-package-your-react-app-with-spring-boot-41432be974bc

Go to Spring Initializr and create an app that has at least the spring web dependency.
Extract that zip file and run mvn install.

Create a eclipse workspace in another folder and into that workspace import an existing maven application.
As a folder select the folder into which you unzipped the zip file.

To create the react app, run:
(Replace <FRONTEND-APP-NAME> by your application name.)

```
npx create-react-app <FRONTEND-APP-NAME>
```
in the folder into which you extracted the spring boot initializer webapp.
To test, cd into the <FRONTEND-APP-NAME> folder and run

```
npm start
```

The frontend starts on localhost:3000, the backend starts on localhost:8080, therefore
when the frontend accesses the backend there will be CORS errors.

Change the package.json and add this snippet under the scripts JSON node.

```
"proxy": "http://localhost:8080",
```

like so:

```

...

  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:8080",
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },

...

```

In order to serve the react app from the Spring boot app:

Under the dependencies section in the maven pom.xml file, add a dependency:

```
<!-- https://mvnrepository.com/artifact/com.github.eirslett/frontend-maven-plugin -->
<dependency>
<groupId>com.github.eirslett</groupId>
<artifactId>frontend-maven-plugin</artifactId>
<version>1.6</version>
</dependency>
```

Under the <plugins> section in the maven pom.xml file, add two plugins:

```
<plugin>
   <groupId>com.github.eirslett</groupId>
   <artifactId>frontend-maven-plugin</artifactId>
   <version>1.6</version>
   <configuration>
      <workingDirectory>basic-frontend-app</workingDirectory>
      <installDirectory>target</installDirectory>
   </configuration>
   <executions>
      <execution>
         <id>install node and npm</id>
         <goals>
            <goal>install-node-and-npm</goal>
         </goals>
         <configuration>
            <nodeVersion>v8.9.4</nodeVersion>
            <npmVersion>5.6.0</npmVersion>
         </configuration>
      </execution>
      <execution>
         <id>npm install</id>
         <goals>
            <goal>npm</goal>
         </goals>
         <configuration>
            <arguments>install</arguments>
         </configuration>
      </execution>
      <execution>
         <id>npm run build</id>
         <goals>
            <goal>npm</goal>
         </goals>
         <configuration>
            <arguments>run build</arguments>
         </configuration>
      </execution>
   </executions>
</plugin>
<plugin>
   <artifactId>maven-antrun-plugin</artifactId>
   <executions>
      <execution>
         <phase>generate-resources</phase>
         <configuration>
            <target>
               <copy todir="${project.build.directory}/classes/public">
                  <fileset dir="${project.basedir}/basic-frontend-app/build"/>
               </copy>
            </target>
         </configuration>
         <goals>
            <goal>run</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```

The eirslett plugin will build the react app and create a production built into the folder
```
basic-frontend-app/build
```
folder.

The ant-run plugin will copy the basic-frontend-app/build folder into
```
<YOUR_MAVEN_PROJECT>/target/classes/public
```
Then, a war file is created.
The war file contains the folder WEB-INF/classes/public/
which contains the index.html of the react app.


```
mvnw spring-boot:run
```

This will run the spring boot app.
Visit http://localhost:8080/login and login with 'user' and the generated password from the command log output.
As soon as you login, you will be directed to the root URL: http://localhost:8080/ which serves the index.html
from the folder WEB-INF/classes/public/ which happens to be the react application!
