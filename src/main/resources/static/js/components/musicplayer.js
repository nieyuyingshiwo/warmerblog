Vue.component('warmer-musicplayer-view', {
    props: ['data'],
    data: function () {
        return {
            musicAudio:{},
            musicList:[],
            currentMusic:{
                title:'',
                singer:'',
                totaltime:'',
            },
            volumeValue:0,
            currentMusicIndex:0,
            musicPanelShowState:false,
            musicPlayState:true,
            musicPlayListShowState:false,
            errorImg : 'this.src="/images/music/a1.png"',
        };
    },
    filters: {

    },
    computed: {

    },
    created(){
        this.initMusic();
    },
    mounted() {
        this.musicAudio=this.$refs.musicAudio;
        this.$watch("musicList", function () {//监听data变化决定是否加载该组件
            if(this.musicList.length>0){
                //自动播放第一首
                var firstMusic=this.musicList[0];
                this.playMusic(firstMusic,0);
            }
        },{immediate:true})//deep:true是深度监控  deep，默认值是 false，代表是否深度监听。 immediate:true代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法，如果为 false就跟我们以前的效果一样，不会在绑定的时候就执行。
    },
    methods: {
        initMusic(){
            var _this=this;
            $.ajax({
                data: {},
                type: "GET",
                url: '/getmusiclist',
                success: function (result) {
                    if(result.code==0){
                        var ms=result.data.rows;
                        _this.musicList.push.apply(_this.musicList,ms);//合并数组push.apply
                    }
                },
                error: function (data) {}
            });
        },
        volume(){
            if(this.musicAudio.volume===0){
                this.musicAudio.volume=this.volumeValue;
            }else{
                this.volumeValue=this.musicAudio.volume;
                this.musicAudio.volume=0;
            }
        },
        play(){
            if(this.musicAudio.paused){
                this.musicAudio.play();//播放
                this.musicPlayState=false;//播放图标
                this.$refs.titleRun.stop();//走马灯开启
                if(this.musicList.length>0&&this.musicAudio.src===''){//默认播放第一首
                    this.currentMusic=this.musicList[0];
                    this.musicAudio.src=this.currentMusic.url;
                }
            }else{
                this.musicPlayState=true;//暂停播放图标
                this.musicAudio.pause();//暂停
                this.$refs.titleRun.start();//走马灯关闭
            }
        },
        playMusic(m,index){
            this.currentMusic=m;
            this.currentMusicIndex=index;
            this.musicAudio.src=this.currentMusic.url;
        },
        prevMusic(){
            if(this.currentMusicIndex<=0){
                this.currentMusicIndex=this.musicList.length-1;//当前为第一首则切换至最后一首
            }else{
                this.currentMusicIndex--;
            }
            this.currentMusic=this.musicList[this.currentMusicIndex];
            this.musicAudio.src=this.currentMusic.url;
        },
        showMusicPanel(){
            this.musicPanelShowState=!this.musicPanelShowState;
        },
        showMusicPlayList(){
            this.musicPlayListShowState=!this.musicPlayListShowState;
        },
        nextMusic(){
            if(this.currentMusicIndex>=this.musicList.length-1){
                this.currentMusicIndex=0;//当前为最后一首则切换至第一首
            }else{
                this.currentMusicIndex++;
            }
            this.currentMusic=this.musicList[this.currentMusicIndex];
            this.musicAudio.src=this.currentMusic.url;
        }
    },
    template:
        `
        <div ref="musicplayer">
			<audio ref="musicAudio"></audio>
			<div @click="showMusicPanel" :class="[musicPlayState ? 'rotate' : '', 'audio_icon']"></div>
			<div class="m_player" v-show="musicPanelShowState">
				<!-- 主体 -->
				<div class="m_player_dock">
					<!-- 歌曲信息 -->
					<div class="music_icon">
						<a href="javascript:;" class="album_pic">
							<img :src="currentMusic.converUrl?currentMusic.converUrl:'/images/music/a1.png'" :onerror="errorImg"  alt="">
						</a>
					</div>
					<!-- 暂停 上一首 下一首 -->
					<div class="bar_op">
						<strong class="prev_bt" title="上一首" @click="prevMusic"></strong>
						<strong :class="[musicPlayState ? 'pause_bt' : 'play_bt','tc']" title="播放"@click="play"></strong>
						<strong class="next_bt" title="下一首" @click="nextMusic"></strong>
					</div>
					<div style="margin-left: 110px;margin-top: -15px;">
						<marquee ref="titleRun" width="150" style="color:#fff">
							{{currentMusic.title}}--{{currentMusic.singer}}
						</marquee>
					</div>
				</div>
				<!-- 隐藏显示按钮 -->
				<button @click="showMusicPanel" type="button" class="folded_bt">
					<i class="el-icon-arrow-right " style="color: #fff"></i>
				</button>
				<!-- 歌曲列表 -->
				<div class="play_list_frame" v-show="musicPlayListShowState">
					<div class="play_list_title">
						<ul>
							<li class="current"><a href="javascript:;">播放列表</a></li>
						</ul>
					</div>
					<div class="play_list">
						<div class="play_list_main">
							<div class="single_list">
								<ul v-if="musicList.length>0">
									<li :class="[currentMusicIndex==index ? 'play_current' : '', 'li']" v-for="(m,index) in musicList" @click="playMusic(m,index)">
										<strong :class="[currentMusicIndex==index ? 'play_current' : '', 'music_name line-limit-length']">
											{{m.title}}--{{m.singer}}
										</strong>
										<div class="list_cp">
											<strong class="btn_like" title="喜欢"></strong>
											<strong class="btn_share" title="分享"></strong>
											<strong class="btn_fav" title="收藏到歌单"></strong>
											<strong class="btn_del" title="从列表中删除"></strong>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>

				</div>
				<!-- 打开隐藏歌曲列表-->
				<span @click="showMusicPlayList" class="open_list">
					<i class="el-icon-tickets"></i>
				</span>
			</div>
		</div>
		`
})