## Creating multiple files in a folder
# confirm folder exists and show all files (including hidden)
Get-ChildItem -Path .\lib\models -Force -File

# show any .ts/.tsx files recursively
Get-ChildItem -Path .\lib\models -Recurse -Include *.ts,*.tsx -File

# Creating files in models folder
$files = 'MediaGroup.ts','Station.ts','Channel.ts','Content.ts','LiveStream.ts','Category.ts','Tag.ts','User.ts','Engagement.ts','index.ts'
foreach ($f in $files) { New-Item -Path ".\lib\models\$f" -ItemType File -Force }


