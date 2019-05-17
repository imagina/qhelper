import {Notify} from 'quasar'

/*
* @msg = type : string / message to show / default : 'Notify'
* @pos = type : string / pos of notify('top', 'left', 'bottom-left'...etc)/ default : 'top-right'
* @action = type : object / action for notify: {
*   label: string / optional / default : 'Ok'
*   icon: string / optional
*   handler: callback() / optional / default : dimiss notify
* }/ default : false
*
* */

class Alert {

	constructor() {
		this.msg = 'Notify';
		this.color = 'green';
		this.action = false;
		this.pos = 'top-right';
		this.icon = 'notifications';
	}

	success(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "green";
		this.icon = "notifications"
		this.show(msg, pos, action, timeOut);
	}

	error(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "negative"
		this.icon = "error",
			this.show(msg, pos, action, timeOut);
	}

	info(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "cyan";
		this.icon = "info";
		this.show(msg, pos, action, timeOut);
	}

	warning(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "warning";
		this.icon = "warning"
		this.show(msg, pos, action, timeOut);
	}

	light(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "faded";
		this.icon = "notifications"
		this.show(msg, pos, action, timeOut);
	}

	dark(msg = this.msg, pos = this.pos, action = this.action, timeOut = 2500) {
		this.color = "black";
		this.icon = "notifications";
		this.show(msg, pos, action, timeOut);
	}

	show(msg, pos, action, timeOut) {
		msg ? this.msg = msg.toString() : false;
		pos ? this.pos = pos : false;

		Notify.create({
			message: this.msg,
			icon: this.icon,
			timeout: action ? 0 : timeOut,
			color: this.color,
			position: this.pos,
			actions: action ? action : [
				{
					label: action.label ? action.label : 'Ok',
					icon: action.icon ? action.icon : '',
					handler: () => {
						action.callback ? action.callback() : false
					}
				}
			],
		})
	}
}

const alert = new Alert();

export default ({Vue}) => {
	Vue.prototype.$alert = alert;
}

export {alert};
