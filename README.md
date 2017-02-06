# static-evemail-client
### A statically-hosted mail client for Eve: Online using ESI and Angular.
#### Installation & Requirements
- [Set up an application](https://developers.eveonline.com/applications) for the ESI API.
	- Include scopes `
		esi-mail.organize_mail,
		esi-mail.read_mail,
		esi-mail.send_mail`
- Clone repository.
- Replace `CLIENT_ID` and `REDIRECT_URI` at the top of `config.js` (matching your application).
- Host files somewhere, and enjoy.
#### Instructions
Due to some [current quirks with ESI](https://github.com/ccpgames/esi-issues/issues/198) and CCP's SSO, you must visit the settings page to manually fill in your character's ID. This should be the same character you plan to authenticate with via SSO. This will be changed once the SSO is fixed.
#### References
- [angular-ui-notification](https://github.com/alexcrack/angular-ui-notification)
- [AngularJS](https://angularjs.org/)
- [Bootstrap v4](https://v4-alpha.getbootstrap.com/)
- [CCP's ESI API](https://esi.tech.ccp.is/)
- [Font Awesome](http://fontawesome.io/)
- [jQuery](https://jquery.com/)
- [Moment.js](https://momentjs.com/)
- [ngStorage](https://github.com/gsklee/ngStorage)
- [Quill](http://quilljs.com/)
- [Swagger JS](https://github.com/swagger-api/swagger-js)
- [Tether](http://tether.io/)