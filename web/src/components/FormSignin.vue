<template>
	<div id="FormSignin" class="c-form">
		<h1 class="text-center title">{{title}}</h1>
		<span id="icon-chat" class="fa fa-comments-o"></span>
		<div class="o-form row">
			<form @submit="submitLogin" :action="url" class="form col-12">
				<div :class="formGroup('email')">
					<input ref="email" class="form-control" v-model="form.email" type="text" name="email" placeholder="Email ...">
					<span v-html="getIcon('email')" class="has-icon"></span>
				</div>
				<div :class="formGroup('password')">
					<input ref="password" class="form-control" v-model="form.password" type="password" name="password" placeholder="Password">
					<span v-html="getIcon('password')" class="has-icon"></span>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Sign in</button>
					<router-link :to="{name: 'Signup'}" class="btn">sign up</router-link>
				</div>
				<div v-if="isMessage" :class="isMessage ? status ? 'alert alert-success': 'alert alert-danger' : 'alert alert-primary' + '\tcol-xs-12'">
					{{message}}
					<router-link v-if="isVerify === false" :to="{name: 'Sendactivation'}" class="btn"><i><small>don't get activation yet?</small></i></router-link>
				</div>
			</form>
		</div>
		<Loader :class="isSubmit ? 'show' : 'hide'"/>
	</div>
</template>

<script> 
const axios = require('axios');
import Loader from './Loader';
export default {
	name: 'FormSignin',
	props: ['signout'],
	components: {
		Loader
	},
	data () {
		return {
			title: 'Start Chatting',
			url: this.$store.getters.getApiUri('auth'),
			form: {
				email: null,
				password: null
			},
			status: false,
			isSubmit: false,
			isMessage: false,
			message: null,
			elerror: null,
			loader: false,
			isVerify: true
		}
	},
	methods: {
		setToken(args) {
			this.$store.dispatch('actToken', args);
		},
		submitLogin(e) {
			e.preventDefault();
			var self = this;
			self.isSubmit = true;
			self.loader = true;
			axios.post(this.url, this.form).then(function (res) {
				setTimeout(function () {
					self.isSubmit = false;
					self.isMessage = true;
					self.loader = false;
					self.message = res.data.msg;
					self.status = res.data.status;
					let args = {token:res.data.token, user: res.data.user, act:true};
					self.setToken(args);
					self.$router.go({name: 'Chat'});
				}, 1000);
			}).catch(function (err) {
				setTimeout(function () {
					self.isSubmit = false;
					self.loader = false;
					if(err.response !== undefined) {
						self.isMessage = true;
						self.message = err.response.data.msg;
						self.elerror =  err.response.data.param;
						self.status = err.response.data.status;
						self.isVerify = err.response.data.verify;
						self.$refs[self.elerror].focus();
					}
				}, 1000);
			});
		},
		getIcon(el) {
			return (el === this.elerror) ? '<span class="form-control-feedback fa fa-times"></span>' : '';
		},
		formGroup(el) {
			let cf = 'form-group';
			cf += (this.isMessage) ? (!this.status && this.elerror === el) ? ' has-danger' : ' has-succes' : '';
			return cf;
		}
	}
}
</script>

<style scoped lang="sass">

</style>