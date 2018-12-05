var siteBasePath =  window.location.href.substr(0, window.location.href.lastIndexOf("/"));
  
Vue.use(VueLocalStorage, {
	namespace: 'vuejs__'
});

function getIcarusUserToken() {
	return Vue.ls.get("icarus_user_token")
}

function setIcarusUserToken(userToken) {
	Vue.ls.set("icarus_user_token", userToken, 1000 * 60 * 60 * 24 * 3) // Expires every 72h
}

function removeIcarusUserToken() {
	Vue.ls.remove("icarus_user_token")
}


// Simple utility to POST data as a form
// based on https://www.npmjs.com/package/submitform
// Seriously, this is the clean way to post an object as a form?
function postForm(url, data) {
	if (typeof data !== 'object') {
		throw new TypeError('Expected an object');
	}
  var form = document.createElement('form');
  form['action'] = url
  form['method'] = 'POST'
	form.style.display = 'none';
	form.appendChild(getInputs(data));

	document.body.appendChild(form);
	form.submit();
}

function getInputs(data) {
	var div = document.createElement('div');

	for (var el in data) {
		if (data.hasOwnProperty(el)) {
			var input = document.createElement('input');
			input.name = el;
			input.value = data[el];
			div.appendChild(input);
		}
	}
	return div;
}
