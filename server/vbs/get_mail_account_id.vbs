Dim obApp
Set obApp = CreateObject("hMailServer.Application")

' Authenticate. Without doing this, we won't have permission
' to change any server settings or add any objects to the
' installation.   
Call obApp.Authenticate("Administrator", "123.0123")

' Locate the domain we want to add the account to
Dim obDomain
Set obDomain = obApp.Domains.ItemByName("tanleidd.fit")

Dim account
account = WScript.Arguments(0)

' To be able to delete an account, we need to know the database
' identifier for it. Because of this, we first need to fetch the account object.      
Dim obAccount
Set obAccount = obDomain.Accounts.ItemByAddress(account + "@tanleidd.fit")

Wsh.echo obAccount.ID