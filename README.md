# webex-training-center-api

This is a package which will allow you to make a webex training session using json input/outputs.


Check src/testcase/createTrainingTest.js 

It will show you how does the module works.

createTrainingHelper function will required two inputs.
First input for authentication
Second input will contains all the properties of webex training meeting.

Authentication input -> {
  webExID: '*****',
  
  password: '******',
  
  serviceUrl: '******'
}

Please check with your webex portal and then fill this information and pass it as the first param of the function.
