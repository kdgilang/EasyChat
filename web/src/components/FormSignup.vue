<template>
	<div id="FormLSignup" class="c-form">
		<h1 class="text-center title">{{title}}</h1>
		<span id="icon-chat" class="fa fa-comments-o"></span>
		<div class="o-form row">
			<form @submit="submitRegister" :action="url" class="col-12" method="post">
				<div :class="formGroup('name')">
					<input ref="name" class="form-control" v-model="form.name" type="text" name="name" placeholder="Name ...">
					<span v-html="getIcon('name')" class="has-icon"></span>
				</div>
				<div :class="formGroup('username')">
					<input ref="username" class="form-control" v-model="form.username" type="text" name="username" placeholder="User Name ...">
					<span v-html="getIcon('username')" class="has-icon"></span>
				</div>
				<div :class="formGroup('email')">
					<input ref="email" class="form-control" v-model="form.email" type="text" name="email" placeholder="Email ...">
					<span v-html="getIcon('email')" class="has-icon"></span>
				</div>
				<div :class="formGroup('password')">
					<input ref="password" class="form-control" v-model="form.password" type="password" name="password" placeholder="Password">
					<span v-html="getIcon('password')" class="has-icon"></span>
				</div>
				<div :class="formGroup('repassword')">
					<input ref="repassword" class="form-control" v-model="form.repassword" type="password" name="repassword" placeholder="Retype Password">
					<span v-html="getIcon('repassword')" class="has-icon"></span>
				</div>
				<div v-if="isMessage" :class="isMessage ? status ? 'alert alert-success': 'alert alert-danger' : 'alert alert-primary' + '\tcol-xs-12'">
					{{message}}
				</div>
				<button class="btn btn-primary">sign up</button>
				<router-link :to="{name: 'Signin'}" class="btn">sign in</router-link>
			</form>
		</div>
		<Loader :class="isSubmit ? 'show' : 'hide'"/>
	</div>
</template>
<script> 
const axios = require('axios');
import Loader from './Loader';
export default {
	name: 'FormLSignup',
	components: {
		Loader
	},
	data () {
		return {
			title: 'Start Chatting',
			url: this.$store.getters.getApiUri('user/add'),
			form: {
				name: null,
				username: null,
				email: null,
				password: null,
				repassword: null
			},
			status: false,
			isSubmit: false,
			isMessage: false,
			message: null,
			elerror: null,
			loader: false
		}
	},
	computed: {
	},
	methods: {
		submitRegister(e) {
			e.preventDefault();
			var self = this;
			if(!self.isSubmit) {
				self.isSubmit = true;
				self.loader = true;
				axios.post(this.url, this.form).then(function (res) {
					setTimeout(function () {
						self.isSubmit = false;
						self.isMessage = true;
						self.loader = false;
						self.message = res.data.msg;
						self.status = res.data.status;
					}, 1000);
				}).catch(function (err) {
					setTimeout(function () {
						self.loader = false;
						self.isSubmit = false;
						if(err.response !== undefined) {
							self.isMessage = true;
							self.message = err.response.data.msg;
							self.elerror =  err.response.data.param;
							self.status = err.response.data.status;
							self.$refs[self.elerror].focus();
						}
					}, 1000);
				});
			}
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