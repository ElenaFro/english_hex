export const formValidator = (nick, email, password) => {
	const errors = {
		nickError: false,
		emailError: false,
		passwordError: false
	};
	
	const symbols = /[A-Za-z0-9]/
	const invalidSymbols = /[<>{}()[],;:\/"*[/]]/

	//Проверка поля ввода ника
	if (!nick.value.trim()) {
		nickError.value = true
	} else {
		nickError.value = false
	}

	//Проверка поля ввода почты
	if (!email.value.trim()) {
		emailError.value = true
		return
	} if (email.value.length < 8 || email.value.length > 30 ) {
		emailError.value = true
		return
	} if (email.value.includes(' ')) {
		emailError.value = true
		return
	} if (invalidSymbols.test(email.value)) {
		emailError.value = true
		return
	} if (!email.value.includes('@')) {
		emailError.value = true
		return
	} if (!symbols.test(email.value)) {
		emailError.value = true
		return
	} else {
		emailError.value = false
	}

	//Проверка поля ввода пароля
	if (!password.value.trim()) {
		passwordError.value = true
		return
	} if (password.value.length < 8 || password.value.length > 30 ) {
		passwordError.value = true
		return
	} if (password.value.includes(' ')) {
		passwordError.value = true
		return
	} if (!symbols.test(password.value)) {
		passwordError.value = true
		return
	} else {
		passwordError.value = false
	}

	return errors
}