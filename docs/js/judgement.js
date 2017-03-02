/**
 * JudgementJS v1.0.0 - JavaScript form validator. Allows to easily validate your forms just with adding some rules in your form elements through the data-rules attribute.
 * https://drasiti.github.io/JudgementJS/
 *
 * Author: Dzulistan Rasiti (rasiti.d@gmail.com)
 *
 * Copyright 2017, Dzulistan Rasiti
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
(function (global, factory){
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Judgement = factory());
}(this, (function(){ 'use strict';
	/**
	 * private vars
	 */
	var regex = {
			rules				: /(.*?)\[(.*?)\]/g,
			date_format			: /^((ddmmyyyy|yyyymmdd),(\/|-|\.))$/,
			alpha 				: /^[a-zA-Z]*$/,
			alpha_numeric 		: /^[a-zA-Z0-9]+$/i,
			alpha_dash 			: /^[a-zA-Z0-9_\-]+$/i,
			alpha_space			: /^[a-zA-Z ]*$/,
			alpha_numeric_space	: /^[a-zA-Z0-9 ]+$/i,
			alpha_dash_space	: /^[a-zA-Z0-9_\- ]+$/i,
			numeric 			: /^\-?[0-9]*\.?[0-9]+$/,
			integer 			: /^\-?[0-9]+$/,
			decimal 			: /^\-?[0-9]+\.[0-9]+$/,
			natural 			: /^[0-9]+$/i,
			natural_no_zero 	: /^[1-9][0-9]*$/i,
			email 				: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
			ip_address 			: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
			base64 				: /[^a-zA-Z0-9\/\+=]/i,
			url 				: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
			password 			: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/,
			credit_card 		: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
			time				: /^(?:0[0-9]|1[0-9]|2[0-3])(:)(?:0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])(:)(?:0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/
		};	

	/**
	 * @constructor
	 */
	var Judgement = function(options){
		var this_ = this,
			errorRules = [];

		this.form = null,
		this.submitButton = null,
		this.errors = [],
		this.successes = [],
		this.fields = [],
		this.field = {},
		this.userOptions = {},
		this.errorMessages = {
				alpha 					: "{field} accepts only alphabetical characters",
				alpha_numeric 			: "{field} accepts only alpha-numeric characters",
				alpha_dash				: "{field} accepts only alpha-numeric characters, underscores, and dashes",
				alpha_space 			: "{field} accepts only alphabetical characters and spaces",
				alpha_numeric_space		: "{field} accepts only alpha-numeric characters and spaces",
				alpha_dash_space		: "{field} accepts only alpha-numeric characters, underscores, dashes and spaces",
				numeric 				: "{field} accepts only numbers (integer or decimal, positve or negative)",
				integer 				: "{field} accepts only numbers (Integer, positive or negative)",
				decimal 				: "{field} accepts only numbers (Decimal, positive or negative. e.g. 10.55)",
				natural 				: "{field} accepts only digits",
				natural_no_zero 		: "{field} accepts only digits and must be greater than zero",
				email 					: "{field} must contain a valid email address",
				ip_address 				: "{field} must contain a valid IP address",
				base64 					: "{field} must contain a base64 string",
				url 					: "{field} must contain a valid url",
				date 					: "{field} must contain a valid date. Format: {format}",
				time 					: "{field} must contain a valid time. Format: hh:mm:ss",
				password 				: "The password must be at least 6 characters long and contain at least 1 Uppercase, 1 lowercase, 1 digit and a special character: ($, @,!,%, *,?, &)",
				credit_card 			: "Incorrect number. Accepted cards: Visa, MasterCard, American Express, Diners Club, Discover and JCB",
				is_nan					: "{field} must be a number.",
				required 				: "{field} is required.",
				requiredCheckbox		: "{field} is required. One of the checkboxes must be checked.",
				requiredRadio			: "{field} is required. Select an option.",
				min_length				: "{field} requires a minimum of {min} characters",
				max_length				: "{field} requires a maximum of {max} characters",
				exact_length			: "{field} requires exactly {exact} characters",
				range_length			: "{field} requires between {min} and {max} characters",
				greater_than			: "{field} requires a value greater than {number}",
				greater_than_equal_to	: "{field} requires a value greater than or equal to {number}",
				less_than				: "{field} requires a value less than {number}",
				less_than_equal_to		: "{field} requires a value less than or equal to {number}",
				in_list					: "{field} accepts only '{values}' values",
				equal_to				: "{field} must be identical to the {target} field",
				different_from			: "{field} must be different from the {target} field"
			};

		var defaults = {
				formId: null,
				submitButtonId: null,
				jsonLangFile: null,
				realTimeChecking: false,
				onBlurChecking: false,
				errorContainer: null,
				inputHighlights: true,
				preventEnterKey: false,
				testMode: false,
				onSubmit: null,
				onSuccess: null,
				onError: null
			};

		if(typeof options === undefined || typeof options !== 'object'){
			throw new Error('options must be an object');
			return;
		}
		if (options && typeof options === "object"){
			this.userOptions = extendDefaults(defaults, options);
	    }
		if(this.userOptions.formId === null || this.userOptions.submitButtonId === null || typeof this.userOptions.formId !== 'string' || typeof this.userOptions.submitButtonId !== 'string'){
			throw new Error('"formId" and "submitButtonId" options are required and must contain a string value. e.g. var form = new Judgement({formId: "myFormId", submitButtonId: "mySubmitButtonId"});');
			return;
		}
		if((!this.userOptions.realTimeChecking && !this.userOptions.onBlurChecking && this.userOptions.errorContainer === null) || (this.userOptions.realTimeChecking && this.userOptions.onBlurChecking && this.userOptions.errorContainer !== null) || (!this.userOptions.realTimeChecking && this.userOptions.onBlurChecking && this.userOptions.errorContainer !== null) || (this.userOptions.realTimeChecking && !this.userOptions.onBlurChecking && this.userOptions.errorContainer !== null) || (this.userOptions.realTimeChecking && !this.userOptions.onBlurChecking && this.userOptions.errorContainer !== null) || (this.userOptions.realTimeChecking && this.userOptions.onBlurChecking && this.userOptions.errorContainer === null)){
			throw new Error("You must choose just one option to handle errors messages:  errorContainer:'id_of_error_container', realTimeChecking: true or onBlurChecking: true");
			return;
		}
		if(this.userOptions.jsonLangFile !== null && typeof this.userOptions.jsonLangFile !== 'string'){
			throw new Error("jsonLangFile option must be a string value");
			return;
		}
		if(this.userOptions.realTimeChecking !== null && typeof this.userOptions.realTimeChecking !== 'boolean'){
			throw new Error("realTimeChecking option must be a boolean value (true/false)");
			return;
		}
		if(this.userOptions.onBlurChecking !== null && typeof this.userOptions.onBlurChecking !== 'boolean'){
			throw new Error("onBlurChecking option must be a boolean value (true/false)");
			return;
		}
		if(this.userOptions.errorContainer !== null && typeof this.userOptions.errorContainer !== 'string'){
			throw new Error("errorContainer option must be a string value");
			return;
		}
		if(this.userOptions.inputHighlights !== null && typeof this.userOptions.inputHighlights !== 'boolean'){
			throw new Error("inputHighlights option must be a boolean value (true/false)");
			return;
		}
		if(this.userOptions.preventEnterKey !== null && typeof this.userOptions.preventEnterKey !== 'boolean'){
			throw new Error("preventEnterKey option must be a boolean value (true/false)");
			return;
		}
		if(this.userOptions.testMode !== null && typeof this.userOptions.testMode !== 'boolean'){
			throw new Error("testMode option must be a boolean value (true/false)");
			return;
		}
		if(this.userOptions.onSubmit !== null && typeof this.userOptions.onSubmit !== 'function'){
			throw new Error("onSubmit option  must be a function");
			return;
		}
		if(this.userOptions.onSuccess !== null && typeof this.userOptions.onSuccess !== 'function'){
			throw new Error("onSuccess option must be a function");
			return;
		}
		if(this.userOptions.onError !== null && typeof this.userOptions.onError !== 'function'){
			throw new Error("onError option must be a function");
			return;
		}
		
		this.form = document.getElementById(this.userOptions.formId);

		this.submitButton = document.getElementById(this.userOptions.submitButtonId);
		this.submitButton.addEventListener('click', function(){
			this_._formCheck();
		}, false);

		var ruleTemp;
		for(var i = 0, iLength = this.form.length; i < iLength; i++){
			var element, dataRules, rules = [], rule, param;

			element = this.form[i];
			dataRules = (typeof this.form[i].dataset.rules !== 'undefined') ? this.form[i].dataset.rules.split('|') : '';

			if(element.dataset.labelName === undefined || element.dataset.labelName == ''){
				element.dataset.labelName = '{label}';
			} else {
				element.dataset.labelName = element.dataset.labelName.trim();
			}

			element.value = element.value.ltrim();

			if(dataRules != ''){
				for(var j = 0, jLength = dataRules.length; j < jLength; j++){
					if(dataRules[j].indexOf('[') > -1){
						while(ruleTemp = regex.rules.exec(dataRules[j])){
							rule = ruleTemp[1].removeSpaces();
							if(this._checkRuleParamValue(rule, ruleTemp[2])){
								if(ruleTemp[2].indexOf(',') > -1){
									if(rule !== 'equal_to' && rule !== 'different_from' && rule !== 'in_list'){
										param = ruleTemp[2].removeSpaces().split(',');
									} else {
										param = ruleTemp[2].trim().split(',');
									}
								} else {
									param = ruleTemp[2];
								}
							} else { // incorrect rule param value
								errorRules.push('The "' + rule + '" rule of "' + element.id + '" field is incorrect. ("rule name" or "rule param value")');
							}
						}
					} else {
						rule = dataRules[j].removeSpaces();
						param = null;
					}

					rules.push({
						rule : rule,
						param : param
					});
				}

				this.fields.push({
					element : element,
					rules : rules
				});
			}
		}

		if(errorRules.length > 0){
			for(var i = 0, iLength = errorRules.length; i < iLength; i++){
				throw new Error(errorRules[i]);
			}
		}
	}

	/**
	 * public methods
	 */
	Judgement.prototype.startJudgement = function(){
		var this_ = this;
		if(this.userOptions.jsonLangFile !== null){
			this._loadJSONLangFile(this.userOptions.jsonLangFile, function(response){
				
				this_.errorMessages = JSON.parse(response);
				
				for(var i = 0, length = this_.form.length; i < length; i++){
					this_._addEvent(this_.form[i]);
				}
			});
		} else {
			for(var i = 0, length = this.form.length; i < length; i++){
				this._addEvent(this.form[i]);
			}
		}
	}

	/**
	 * private methods
	 */
	Judgement.prototype._loadJSONLangFile = function(jsonLangFile, callback){
		var xhr;
		try {
			xhr = new XMLHttpRequest();
		} catch (e1) {
			try {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e2) {
				try {
					xhr = new ActiveXObject('Msxml2.XMLHTTP');
				} catch (e3) {
					xhr = false;
				}
			}
		}
		xhr.overrideMimeType("application/json");
		xhr.open('GET', jsonLangFile, true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status == 200){
				callback(xhr.responseText);
			}
		}
		xhr.send(null);
	}

	Judgement.prototype._addEvent = function(element){
		var this_ = this;
		switch(element.type){
			case 'text': 
			case 'password':
		    case 'color':
		    case 'date':
		    case 'datetime':
		    case 'datetimeLocal':
		    case 'email':
		    case 'month':
		    case 'number':
		    case 'range':
		    case 'search':
		    case 'tel':
		    case 'time':
		    case 'url':
		    case 'week':
				if(element.dataset.rules !== undefined){
					if(this.userOptions.realTimeChecking) {
						element.onkeyup = this._checkInput.bind(this, element);
						element.onblur = this._checkInput.bind(this, element);
					} else if(this.userOptions.onBlurChecking){
						element.onblur = this._checkInput.bind(this, element);
					} else {}
				}

				if(!this.userOptions.preventEnterKey){
					element.onkeypress = this._isEnterKey.bind(this);
				}
		    break;

		    case 'select-one':
		    case 'select-multiple':
				if(element.dataset.rules !== undefined){
					if(this.userOptions.realTimeChecking || this.userOptions.onBlurChecking) {
						element.onchange = this._checkInput.bind(this, element);
						element.onblur = this._checkInput.bind(this, element);
					}
				}

				if(!this.userOptions.preventEnterKey){
					element.onkeypress = this._isEnterKey.bind(this);
				}
		    break;

		    case 'checkbox':
		    case 'radio':
				if(element.dataset.rules !== undefined){
					if(this.userOptions.realTimeChecking || this.userOptions.onBlurChecking) {
						element.onclick = this._checkInput.bind(this, element);
						element.onblur = this._checkInput.bind(this, element);
					}
				}

				if(!this.userOptions.preventEnterKey){
					element.onkeypress = this._isEnterKey.bind(this);
				}
		    break;
		}
	}

	Judgement.prototype._checkRuleParamValue = function(rule, param) {
		switch(rule){
			case 'date':
				return regex.date_format.test(param.removeSpaces());
			break;

			case 'min_length':
			case 'max_length':
			case 'exact_length':
				return regex.natural.test(param.removeSpaces());
			break;

			case 'range_length':
				var range = param.removeSpaces().split(',');
				return (regex.natural.test(range[0]) && regex.natural.test(range[1])) && (parseInt(range[0]) < parseInt(range[1]));
			break;

			case 'greater_than':
			case 'greater_than_equal_to':
			case 'less_than':
			case 'less_than_equal_to':
				return regex.numeric.test(param.removeSpaces());
			break;

			case 'equal_to':
			case 'different_from':
				var listValues = param.trim().split(',');
				return listValues.length == 2 && (document.getElementById(listValues[0]) !== null)
			break;

			case 'in_list':
				return true;
			break;

			default:
				return false;
			break;
		}
	};

	Judgement.prototype._isEnterKey = function(e){
		if(e && e.keyCode == 13){
			e.preventDefault();
	    	this.submitButton.click();
	   	}
	}

	Judgement.prototype._formCheck = function(){
	  	this.form.onsubmit = this._checkForm();
	}

	Judgement.prototype._sendForm = function(){
  		this.form.submit();
  	}

	Judgement.prototype._checkInput = function(element){
		this.errors = [];

		element.value = element.value.ltrim();

		this.field = getElementFromFields(element, this.fields);

		if(this.field.rules.length > 0){
			var result = this._checkField(this.field);
			if(result !== true){
				if(!elementExists(this.errors, result)){
					this.errors.push(result);
				}
			} else {
				if(!elementExists(this.successes, this.field.element.id)){
					this.successes.push({elementId: this.field.element.id});
				}
			}

			var toRemove = document.getElementById('j-error-' + this.field.element.id);
			if(toRemove !== null){
				toRemove.parentNode.removeChild(toRemove);
			}
		}

		this._displayResults(this.field);
	}

	Judgement.prototype._checkForm = function(){
  		this.errors = [];

  		for(var i = 0, iLength = this.fields.length; i < iLength ; i++){
  			if(this.fields[i].rules.length > 0){
				var result = this._checkField(this.fields[i]);
				if(result !== true){
					if(!elementExists(this.errors, result)){
						this.errors.push(result);
					}
				} else {
					if(!elementExists(this.successes, this.fields[i].element.id)){
						this.successes.push({elementId: this.fields[i].element.id});
					}
				}
  			}
  		}

		this._displayResults(this.fields);

		return false;
  	}

	Judgement.prototype._displayResults = function(fields){
		if(isArray(fields)){
			if(this.userOptions.errorContainer === null){
				for(var i = 0; i < fields.length; i++){
					var element = fields[i].element;

					var toRemove = document.getElementById('j-error-' + element.id);
					if(toRemove !== null){
						toRemove.parentNode.removeChild(toRemove);
					}

					element.classList.remove('j-error-highlight');
					element.classList.remove('j-success-highlight');
				}
			} else {
				document.getElementById(this.userOptions.errorContainer).innerHTML = '';
				document.getElementById(this.userOptions.errorContainer).style.display = 'none';
			}
		} else {
			var toRemove = document.getElementById('j-error-' + fields.element.id);
			if(toRemove !== null){
				toRemove.parentNode.removeChild(toRemove);
			}

			fields.element.classList.remove('j-error-highlight');
			fields.element.classList.remove('j-success-highlight');
		}

		if(this.errors.length > 0){ // Error
			var errorSpan;
			if(this.userOptions.onError !== null && typeof this.userOptions.onError === 'function'){
				this.userOptions.onError.call(undefined, this.errors);
			} else {
				if((this.userOptions.errorContainer === null && (isArray(fields) || isObject(fields))) || (this.userOptions.errorContainer !== null && isObject(fields))){
					for(var i = 0; i < this.errors.length; i++){
						var element = document.getElementById(this.errors[i].elementId);

						errorSpan = document.createElement('span');
						errorSpan.setAttribute('class', 'j-error');
						errorSpan.setAttribute('id', 'j-error-' + element.id);
						errorSpan.innerHTML = this.errors[i].message;
						element.parentNode.insertBefore(errorSpan, element);

						if(this.userOptions.inputHighlights){
							element.classList.remove('j-error-highlight');
							element.classList.remove('j-success-highlight');

							element.classList.add('j-error-highlight');
						}

						if(fields.length > 0){
							for(var j = 0, jLength = fields.length; j < jLength; j++){
								if(!inputHasError(fields[j].element, this.errors)){
									document.getElementById(fields[j].element.id).classList.remove('j-error-highlight');
									document.getElementById(fields[j].element.id).classList.remove('j-success-highlight');
									document.getElementById(fields[j].element.id).classList.add('j-success-highlight');
								}
							}
						} else {
							if(!inputHasError(fields.element, this.errors)){
								document.getElementById(fields.element.id).classList.remove('j-error-highlight');
								document.getElementById(fields.element.id).classList.remove('j-success-highlight');
								document.getElementById(fields.element.id).classList.add('j-success-highlight');
							}
						}
					}
				} else {
					for(var i = 0, iLength = this.errors.length; i < iLength; i++){
						var errorContainer = document.getElementById(this.userOptions.errorContainer);
						var element = document.getElementById(this.errors[i].elementId);

						errorSpan = document.createElement('span');
						errorSpan.setAttribute('class', 'j-error');
						errorSpan.setAttribute('id', 'j-error-' + this.errors[i].elementId);
						errorSpan.innerHTML = this.errors[i].message;
						errorContainer.appendChild(errorSpan);
						errorContainer.style.display = '';

						if(this.userOptions.inputHighlights){
							element.classList.remove('j-error-highlight');
							element.classList.remove('j-success-highlight');
							element.classList.add('j-error-highlight');

							for(var j = 0, jLength = fields.length; j < jLength; j++){
								if(!inputHasError(fields[j].element, this.errors)){
									document.getElementById(fields[j].element.id).classList.remove('j-error-highlight');
									document.getElementById(fields[j].element.id).classList.remove('j-success-highlight');
									document.getElementById(fields[j].element.id).classList.add('j-success-highlight');
								}
							}
						}
					}
				}
			}
  		} else { // Success
			if(this.userOptions.onSuccess !== null && typeof this.userOptions.onSuccess === 'function'){
				this.userOptions.onSuccess.call(undefined, this.successes);
			} else {
				if(isArray(fields)){
					for(var i = 0; i < fields.length; i++){
						var element = fields[i].element;

						element.classList.remove('j-error-highlight');
						element.classList.remove('j-success-highlight');

						if(this.userOptions.inputHighlights){
							element.classList.add('j-success-highlight');
						}
					}

					if(!this.userOptions.testMode && this.userOptions.onSubmit === null){
						this._sendForm();
					}

					if(this.userOptions.onSubmit !== null && typeof this.userOptions.onSubmit === 'function'){
						this.userOptions.onSubmit.call(undefined, this.form);
					}

					if(this.userOptions.errorContainer !== null){
						document.getElementById(this.userOptions.errorContainer).innerHTML = '';
						document.getElementById(this.userOptions.errorContainer).style.display = 'none';
					}
				} else {
					fields.element.classList.remove('j-error-highlight');
					fields.element.classList.remove('j-success-highlight');

					if(this.userOptions.inputHighlights){
						fields.element.classList.add('j-success-highlight');
					}
				}
			}
  		}
	}

	Judgement.prototype._checkField = function(field){
		var error = {},
			element = field.element,
			rules = field.rules,
			rule, param,
			tabRules = ['alpha','alpha_numeric','alpha_dash','alpha_space','alpha_numeric_space','alpha_dash_space','numeric','integer','decimal','natural','natural_no_zero','email','ip_address','base64','url','password','credit_card','time'];

		for(var i = 0, iLength = rules.length; i < iLength; i++){

			rule = rules[i].rule;
			param = rules[i].param;

			if(param !== null){
				if(rule == 'date'){					
					var strRegEx,
						delimiter,
						dateFormat;
					switch(param[0]){
						case 'ddmmyyyy':
							delimiter = (param[1] == '.' || param[1] == '/') ? '(\\' + param[1] + ')' : '(' + param[1] + ')';
							strRegEx = '^(?:(?:31' + delimiter + '(?:0[13578]|1[02]))\\1|(?:(?:29|30)' + delimiter + '(?:0[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)\\d{2})$|^(?:29' + delimiter + '02\\3(?:(?:(?:1[6-9]|[2-9]\\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0[1-9]|1\\d|2[0-8])' + delimiter + '(?:(?:0[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)\\d{2})$';
							dateFormat = 'dd' + param[1] + 'mm' + param[1] + 'yyyy';
						break;

						case 'yyyymmdd':
							delimiter = (param[1] == '.' || param[1] == '/') ? '(\\' + param[1] + ')' : '(' + param[1] + ')';
							strRegEx = '^(?:(?:1[6-9]|[2-9]\\d)?\\d{2}' + delimiter + ')(?:(?:(?:0[13578]|1[02])' + delimiter + '31)|(?:(?:0[1,3-9]|1[0-2])' + delimiter + '(?:29|30)))$|^(?:(?:(?:(?:1[6-9]|[2-9]\\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))' + delimiter + '02' + delimiter + '29)$|^(?:(?:1[6-9]|[2-9]\\d)\\d{2})' + delimiter + '(?:(?:0[1-9])|(?:1[0-2]))' + delimiter + '(?:0[1-9]|1\\d|2[0-8])$';
							dateFormat = 'yyyy' + param[1] + 'mm' + param[1] + 'dd';
						break;
					}

					var dateRegEx = new RegExp(strRegEx);

					if( ! dateRegEx.test(element.value) && element.value.trim() != '' ){
						error = {
							elementId : element.id,
							message : this.errorMessages.date.formatError({field: element.dataset.labelName, format: dateFormat})
						};
						break;
					}
				}

				if(rule == 'min_length'){
					if(element.value.trim().length < parseInt(param.removeSpaces()) && element.value.trim() != ''){
						error = {
							elementId : element.id,
							message : this.errorMessages.min_length.formatError({field: element.dataset.labelName, min: param.removeSpaces()})
						};
						break;
					}
				}

				if(rule == 'max_length'){
					if(element.value.trim().length > parseInt(param.removeSpaces()) && element.value.trim() != ''){
						error = {
							elementId : element.id,
							message : this.errorMessages.max_length.formatError({field: element.dataset.labelName, max: param.removeSpaces()})
						};
						break;
					}
				}

				if(rule == 'range_length'){
					if((element.value.trim().length < parseInt(param[0].removeSpaces()) || element.value.trim().length > parseInt(param[1].removeSpaces())) && element.value.trim() != ''){
						error = {
							elementId : element.id,
							message : this.errorMessages.range_length.formatError({field: element.dataset.labelName, min: param[0], max: param[1]})
						};
						break;
					}
				}

				if(rule == 'exact_length'){
					if(element.value.trim().length != parseInt(param.removeSpaces()) && element.value.trim() != ''){
						error = {
							elementId : element.id,
							message : this.errorMessages.exact_length.formatError({field: element.dataset.labelName, exact: param.removeSpaces()})
						};
						break;
					}
				}

				if(rule == 'greater_than'){
					if(element.value.trim() != ''){
						if(regex.numeric.test(element.value.trim())){
							if(parseFloat(element.value.trim()) <= param.removeSpaces()){
								error = {
									elementId : element.id,
									message : this.errorMessages.greater_than.formatError({field: element.dataset.labelName, number: param.removeSpaces()})
								};
								break;
							}
						} else {
							error = {
								elementId : element.id,
								message : this.errorMessages.is_nan.formatError({field: element.dataset.labelName})
							};
							break;
						}
					}
				}

				if(rule == 'greater_than_equal_to'){
					if(element.value.trim() != ''){
						if(regex.numeric.test(element.value.trim())){
							if(parseFloat(element.value.trim()) < param.removeSpaces()){
								error = {
									elementId : element.id,
									message : this.errorMessages.greater_than_equal_to.formatError({field: element.dataset.labelName, number: param.removeSpaces()})
								};
								break;
							}
						} else {
							error = {
								elementId : element.id,
								message : this.errorMessages.is_nan.formatError({field: element.dataset.labelName})
							};
							break;
						}
					}
				}

				if(rule == 'less_than'){
					if(element.value.trim() != ''){
						if(regex.numeric.test(element.value.trim())){
							if(parseFloat(element.value.trim()) >= param.removeSpaces()){
								error = {
									elementId : element.id,
									message : this.errorMessages.less_than.formatError({field: element.dataset.labelName, number: param.removeSpaces()})
								};
								break;
							}
						} else {
							error = {
								elementId : element.id,
								message : this.errorMessages.is_nan.formatError({field: element.dataset.labelName})
							};
							break;
						}
					}
				}

				if(rule == 'less_than_equal_to'){
					if(element.value.trim() != ''){
						if(regex.numeric.test(element.value.trim())){
							if(parseFloat(element.value.trim()) > param.removeSpaces()){
								error = {
									elementId : element.id,
									message : this.errorMessages.less_than_equal_to.formatError({field: element.dataset.labelName, number: param.removeSpaces()})
								};
								break;
							}
						} else {
							error = {
								elementId : element.id,
								message : this.errorMessages.is_nan.formatError({field: element.dataset.labelName})
							};
							break;
						}
					}
				}

				if(rule == 'in_list'){
					var result = false;
					
					if(element.value.trim() != ''){
						for(var i = 0; i < param.length; i++){
							if(param[i].trim() == element.value.trim())
							{
								result = true;
							}
						}

						if(!result){
							error = {
								elementId : element.id,
								message : this.errorMessages.in_list.formatError({field: element.dataset.labelName, values: param.join()})
							};
							break;
						}
					}
				}

				if(rule == 'equal_to'){
					if(document.getElementById(param[0]).value != element.value){
						error = {
							elementId : element.id,
							message : this.errorMessages.equal_to.formatError({field: element.dataset.labelName, target: param[1]})
						};
						break;
					}
				}

				if(rule == 'different_from'){
					if(document.getElementById(param[0]).value == element.value){
						error = {
							elementId : element.id,
							message : this.errorMessages.different_from.formatError({field: element.dataset.labelName, target: param[1]})
						};
						break;
					}
				}
			} else { // if(param === null)
				if(rule == 'required'){
					if(element.type == 'checkbox' || element.type == 'radio'){
						if(element.checked !== true){
							error = {
								elementId : element.id,
								message : this.errorMessages.required.formatError({field: element.dataset.labelName})
							};
							break;
						}						
					} else {
						if(element.value.trim() == '')
						{
							error = {
								elementId : element.id,
								message : this.errorMessages.required.formatError({field: element.dataset.labelName})
							};
							break;
						}
					}
				}

				// Only for "Radios & Checkboxes inputs"
				if(rule == 'required_one_of'){
					var checkboxesOrRadios = document.getElementsByName(element.name);

					if(checkboxesOrRadios !== null){
						var firstElement = checkboxesOrRadios[0];

						var toRemove = document.getElementById('j-error-' + firstElement.id);
						if(toRemove !== null){
							toRemove.parentNode.removeChild(toRemove);
						}

						if(firstElement.type == 'checkbox' || firstElement.type == 'radio'){
							var noCheckboxRadioError = false;

							for(var i = 0, length = checkboxesOrRadios.length; i < length; i++){
								if(checkboxesOrRadios[i].checked === true)
								{
									noCheckboxRadioError = true;
								}
							}

							if(noCheckboxRadioError === false){
								if(firstElement.type == 'checkbox'){
									error = {
										elementId : firstElement.id,
										message : this.errorMessages.requiredCheckbox.formatError({field: firstElement.dataset.labelName})
									};
									break;
								} else {
									error = {
										elementId : firstElement.id,
										message : this.errorMessages.requiredRadio.formatError({field: firstElement.dataset.labelName})
									};
									break;
								}
							}
						}
					}
				}

				if(tabRules.indexOf(rule) > -1){
					if( ! regex[rule].test(element.value) && element.value.trim() != '' ){
						if(rule != 'password' && rule != 'credit_card'){
							error = {
								elementId : element.id,
								message : this.errorMessages[rule].formatError({field: element.dataset.labelName})
							};
							break;
						} else {
							error = {
								elementId : element.id,
								message : this.errorMessages[rule]
							};
							break;
						}
					}
				}
			}
		}

		if(!isEmpty(error)){
			return error;
		} else {
			return true;
		}
	}

	/**
	 * Utilities methods
	 */
	function extendDefaults(source, properties){
		var property;
		for (property in properties){
			if (source.hasOwnProperty(property)){
				source[property] = properties[property];
			}
		}
		return source;
	}

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)){
				return false;
			}
		}
		
		return JSON.stringify(obj) === JSON.stringify({});
	}
	
	String.prototype.formatError = function(vals){
		return this.replace(/{([^\}]+)\}/g, function(match, $1){
			return String(vals[$1]);
		});
	}	
	String.prototype.ltrim = function(){
		return this.replace(/^\s+/, "");
	}
	String.prototype.removeSpaces = function(){
		return this.replace(/\s/g, "");
	}

	function elementExists(obj, elem){
		if(typeof elem === 'object'){
			for(var i = 0, iLength = obj.length; i < iLength; i++){
				if(obj[i].elementId == elem.elementId) return true;
			}
		} else if(typeof elem === 'string'){
			for(var i = 0, iLength = obj.length; i < iLength; i++){
				if(obj[i].elementId == elem) return true;
			}
		}

		return false;
	}

	function inputHasError(formInput, errors){
		for(var i = 0, iLength = errors.length; i < iLength; i++){
			if(formInput.id == errors[i].elementId){
				return true;
			}
		}

		return false;
	}

	function getElementFromFields(element, fields){
		var field = '';
		for(var i = 0, iLength = fields.length; i < iLength; i++){
			if(element.id == fields[i].element.id){
				field  = fields[i];
				break;
			}
		}

		return (field !== '') ? field : false;
	}

	function isArray(object){		
		return Object.prototype.toString.call(object) === '[object Array]';
	}

	function isObject(object){
		return Object.prototype.toString.call(object) === '[object Object]';
	}

	return Judgement;
})));