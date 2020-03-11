$url = 'http://volunteer/api/users'
$name = 'admin'
$password = $args[0]
$admin = 'true'
$id = '16'
$params = @{ username=$name
             password=$password 
             admin=$admin 
             id=$id 
           }
$body = (ConvertTo-Json $params)
$response = try { 
    (Invoke-RestMethod -Uri $url -Method Put -Body $body -ContentType 'application/json' -ErrorAction Stop).BaseResponse
} catch [System.Net.WebException] { 
    write-host "An exception was caught: $($_.Exception.Message)"
    ##write-host "An error occurred with status code $_.Exception.Response.StatusCode.value__."
    ##write-host "Status Description: $_.Exception.Response.StatusDescription"
    throw $_.Exception.Response 
}

write-host "Password changed."	

