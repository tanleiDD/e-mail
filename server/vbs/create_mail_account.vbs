Dim obApp
Set obApp = CreateObject("hMailServer.Application")

' Authenticate. Without doing this, we won't have permission
' to change any server settings or add any objects to the
' installation.   
Call obApp.Authenticate("Administrator", "123.0123")

' Locate the domain we want to add the account to
Dim obDomain
Set obDomain = obApp.Domains.ItemByName("tanleidd.fit")

Dim obAccount
Set obAccount = obDomain.Accounts.Add

Dim account
account = WScript.Arguments(0)

Dim password
password = WScript.Arguments(1)

' Set the account properties
obAccount.Address = account + "@tanleidd.fit"
obAccount.Password = password
obAccount.Active = True

obAccount.Save