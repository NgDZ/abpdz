$version = '0.0.5'
$orgDir = '..\..\freetime'

Set-Location ..\angular
Remove-Item -Recurse -Force .\lib\core\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\core\ .\lib\core\src\lib
ng build core   --prod


Remove-Item -Recurse -Force .\lib\theme-shared\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\theme.shared\ .\lib\theme-shared\src\lib
ng build theme-shared    --prod



Remove-Item -Recurse -Force .\lib\theme-basic\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\theme.basic\ .\lib\theme-basic\src\lib
ng build theme-basic   --prod




Remove-Item -Recurse -Force .\lib\theme-material\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\theme.material\ .\lib\theme-material\src\lib
ng build theme-material   --prod



Remove-Item -Recurse -Force .\lib\account\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\account\ .\lib\account\src\lib
ng build account   --prod



Remove-Item -Recurse -Force .\lib\permission-management\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\permission-management\ .\lib\permission-management\src\lib
ng build permission-management   --prod

Remove-Item -Recurse -Force .\lib\identity\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\identity\ .\lib\identity\src\lib
ng build identity   --prod



Remove-Item -Recurse -Force .\lib\breeze\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\breeze\ .\lib\breeze\src\lib
ng build breeze   --prod


Remove-Item -Recurse -Force .\lib\demos\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\demos\ .\lib\demos\src\lib
ng build demos   --prod



Remove-Item -Recurse -Force .\lib\audit\src\lib\
Copy-Item -Force -Recurse $orgDir\angular\src\abp\audit\ .\lib\audit\src\lib
ng build audit   --prod

Set-Location .\dist\

Get-ChildItem -Recurse *.map |Remove-Item 

Set-Location .\account\


((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
npm publish --access public --ignore-scripts 

Set-Location ..\core\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json
npm publish --access public --ignore-scripts

Set-Location ..\demos\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts

Set-Location ..\breeze\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 

Set-Location ..\theme-shared\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 

Set-Location ..\theme-basic\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 

Set-Location ..\theme-material\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 


Set-Location ..\permission-management\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 

Set-Location ..\identity\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json
npm publish --access public --ignore-scripts 

Set-Location ..\audit\
((Get-Content -path package.json -Raw) -replace '0.0.1' , $version) | Set-Content -Path package.json
((Get-Content -path package.json -Raw) -replace 'prepublishOnly' , 'pry') | Set-Content -Path package.json

npm publish --access public --ignore-scripts 

 
Set-Location ..\..\scripts