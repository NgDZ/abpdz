$srcLocation = '..\freetime'
Set-Location ..
Remove-Item -Recurse -Force .\aspnet-core\
Copy-Item -Recurse $srcLocation\aspnet-core\src\AbpDz\  .\aspnet-core\
Set-Location .\scripts\