<template>
  <div class="row">
    <div id="contact" class="col-4">
      <div class="group-contact">
        <h5 class="label contact-label"><span class="fa fa-address-book"></span>History</h5>
        <search-user></search-user>
        <user-list @delete-user="deleteUser" @select-user="selectUser" cs="contact-list" :users="users" show="true"></user-list>
      </div>
    </div>
    <div id="chatroom" class="col-8">
      <div class="group-room">
        <ul class="list chat-list">
          <chat-list v-for="list, key in lists" :user="list.user" :message="list.message" :mc="list.mc" :key="key"/>
        </ul>
        <div class="editor-panel">
            <div class="row">
              <div class="col-9">
                <input @keyup.enter="sendMessage" id="chateditor" placeholder="Type a message" v-model="message.body"/>
              </div>
              <div class="col-3">
                <a href="javascript:;" class="button btn-emoji"><span class="fa fa-smile-o"></span></a>
                <a @click.prevent="sendMessage" class="button btn-send"><span class="fa fa-paper-plane"></span></a>
              </div>
            </div>
        </div>
      </div>    
    </div>
    <router-link :to="{name: 'Signin', query:{signout: true}}" class="signout" title="signout"><span class="fa fa-sign-out"></span></router-link>
  </div>
</template>

<script>
import ChatList from './chat-list'
import SearchUser from './search-user'
import UserList from './user-list'
export default {
  name: 'Chat',
  components: {
    ChatList,
    SearchUser,
    UserList
  },
  data () {
    return {
      user: JSON.parse(this.$store.getters.currentUser),
      message: {
        body: '',
        to: null,
        date: Date.now()
      },
      lists: []
    }
  },
  computed: {
    users() {
      return this.$store.state.userHistory;
    }
  },
  sockets: {
    connect: function() {
      console.log('connected');
    },
    message: function(val) {
      if(val.user.email === this.user.email) {
        val.mc ='right';
      } else {
        val.mc ='left';
      }
      this.lists.push(val);
    }
  },
  methods: {
    sendMessage() {
      if(/\S/.test(this.message.body) && this.message.body !== '') {
        let that = this;
        this.$store.dispatch('postApi', {
          url: this.$store.getters.getApiUri('message'),
          data: that.message,
          type: 'application/json',
          success: function (res) {
            that.message.body = '';
          }
        });
      }
    },
    deleteUser(data) {
     this.$store.state.userHistory.splice(data,1);
    },
    selectUser(data) {
      this.message.to = data.email;
    }
  },
  created: function() {
    this.$store.dispatch('getApi', {
      url: this.$store.getters.getApiUri('message'),
      success: function (res) {
        console.log(res);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  // @import '../assets/scss/bootstrap/bootstrap'
  // @import '../assets/scss/variable'
  // @import '../assets/scss/helper'
  // @import '../assets/scss/chat'
</style>
