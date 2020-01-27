cd C:\Program Files\Java\jdk1.7.0_21\bin\ 
keytool -genkey -keystore myKeystore -alias ClintonMorrison 
keytool -selfcert -alias ClintonMorrison -keystore myKeystore 
jarsigner -keystore myKeystore [path to JAR]\pong.jar ClintonMorrison 