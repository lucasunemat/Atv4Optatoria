'use strict';

(() => {
    const form = document.querySelector('[data-form]');
    const progressBar = document.querySelector('[data-requirement-progressbar');
    const fields = {};
    const requirements = {};
    const submitButton = document.querySelector('#id-submit');
    const state = { passwordStrength: 0 };

    const showMessageError = (field, message) => {
        const { element, errorElement } = field;
        element.classList.add('error'); //adiciona classe error
        errorElement.style.display = 'block'; //mostra mensagem de erro
        errorElement.textContent = message; //adiciona texto de erro
    }

    const hideMessageError = (field) => {
        const { element, errorElement } = field;
        element.classList.remove('error');
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }

    const onInputFocus = (event) => {
        hideMessageError(fields[event.target.name]);
    }

    const validateEmail = () => {
        let isInvalid = false;
        const field = fields['id-user'];
        const { value } = field.element;
        const emailPattern = new RegExp(/^[\w\.]+@\w+(\.\w+)+$/);
        if (!value.match(emailPattern)) {
            isInvalid = true;
            submitButton.setAttribute('disabled', 'disabled');
            showMessageError(field, 'E-mail inválido!');
        } else {
            isInvalid = false;
            hideMessageError(field)
        }
        return isInvalid;
    }

    const validatePasswordStrength = () => {
        let isInvalid = false;
        const field = fields['id-pass'];
        if (state.passwordStrength < 100) {
            submitButton.setAttribute('disabled', 'disabled');
            isInvalid = true;
            showMessageError(field, 'Senha inválida!');
        } else {
            isInvalid = false;
            submitButton.removeAttribute('disabled');
            hideMessageError(field);
        }
        return isInvalid;
    }

    //melhorar com passWord strength
    const onInputPasswordKeyUp = (event) => {
        const { value } = event.target;
        const upperCasePattern = new RegExp(/[A-Z]/);
        const lowerCasePattern = new RegExp(/[a-z]/);
        const numberPattern = new RegExp(/[0-9]/);
        const specialCharacterPattern = new RegExp(/[!@#$%\^&*~)\[\]{}?\.(+=\._-]/);

        state.passwordStrength = 0;
        if (value.length >= 8) {
            state.passwordStrength += 25;
            requirements['minCharacter'].classList.add('checked');
        } else {
            requirements['minCharacter'].classList.remove('checked');
            submitButton.setAttribute('disabled', 'disabled');
        }
        if (value.match(upperCasePattern) && value.match(lowerCasePattern)) {
            state.passwordStrength += 25;
            requirements['upperLowerCase'].classList.add('checked');
        } else {
            requirements['upperLowerCase'].classList.remove('checked');
            submitButton.setAttribute('disabled', 'disabled');
        }
        if (value.match(numberPattern)) {
            state.passwordStrength += 25;
            requirements['number'].classList.add('checked');
        } else {
            requirements['number'].classList.remove('checked');
            submitButton.setAttribute('disabled', 'disabled');
        }
        if (value.match(specialCharacterPattern)) {
            state.passwordStrength += 25;
            requirements['specialCharacter'].classList.add('checked');
        } else {
            requirements['specialCharacter'].classList.remove('checked');
            submitButton.setAttribute('disabled', 'disabled');
        }

        progressBar.style.width = `${state.passwordStrength}%`;
        progressBar.dataset.percentage = state.passwordStrength;
    }

    const validateRequiredFields = () => {
        let isInvalid = false;
        for (const fieldKey in fields) {
            const field = fields[fieldKey];
            const { element, isRequired } = field;
            if (!element.value && isRequired) {
                isInvalid = true;
                showMessageError(field, "Este campo é obrigatório!");
                submitButton.setAttribute('disabled', 'disabled');
            }
        }
        return isInvalid;
    }

    const setRequirementItemsElements = () => {
        const requirementItemsElements = document.querySelectorAll('[data-requirement-item]');
        for (const requirementItem of requirementItemsElements) {
            const requirementName = requirementItem.dataset['requirementItem']
            requirements[requirementName] = requirementItem;
        }
    }

    const setFieldElements = () => {
        const inputElements = document.querySelectorAll('[data-input]');
        for (const input of inputElements) {
            const inputName = input.getAttribute('name');
            const inputPai = input.parentNode; // gambiarra para capturar avô e acessar a mensagem de erro
            fields[inputName] = {
                element: input,
                errorElement: inputPai.parentNode.querySelector('[data-error-message]'),
                isRequired: input.hasAttribute('required')
            }
            input.removeAttribute('required');
        }
    }

    const totalValidation = (event) => {
        event.preventDefault()
        if (validateEmail()) return;
        if (validatePasswordStrength()) return;
        if (validateRequiredFields()) return;
    }

    const setListeners = () => {
        form.addEventListener('submit', () => { window.alert('dados enviados!') });
        for (const fieldKey in fields) {
            const { element } = fields[fieldKey];
            element.addEventListener('focus', onInputFocus);
            if (fieldKey === 'id-pass') element.addEventListener('keyup', onInputPasswordKeyUp);
            if (fieldKey === 'id-user') element.addEventListener('keyup', validateEmail);
            if (fieldKey === 'id-pass') element.addEventListener('keyup', validatePasswordStrength);
            if (fieldKey === 'id-pass') element.addEventListener('keyup', totalValidation);
            if (fieldKey === 'id-user') element.addEventListener('keyup', totalValidation);

        }
    }

    const init = () => {
        setFieldElements();
        setRequirementItemsElements();
        setListeners();
        submitButton.setAttribute('disabled', 'disabled');
    }

    init();
})()