<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans flex flex-col">
		<!-- Fixed Header - now takes 1/5 of screen height -->
		<header class="fixed top-0 left-0 right-0 shadow-sm z-50 h-[20vh] max-h-24 bg-white">
			<div class="mx-auto px-4 h-full">
				<div class="flex items-center justify-between h-full">
					<!-- Logo/Home Button -->
					<button @click="navigateToHome" class="flex items-center focus:outline-none">
						<div
							class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center transition-colors hover:bg-indigo-700">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20"
								fill="currentColor">
								<path
									d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
							</svg>
						</div>
						<span class="ml-3 text-xl font-bold text-indigo-900 hidden sm:block">SpeechMaster</span>
					</button>

					<!-- Navigation -->
					<nav class="flex items-center space-x-2 sm:space-x-4">
						<button @click="scrollToAbout"
							class="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
							{{ language === 'en' ? 'About' : '关于'}}
						</button>
						<a href="#" target="_blank"
							class="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm sm:text-base rounded-full shadow hover:shadow-md transition-all flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1"
								viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd"
									d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
									clip-rule="evenodd" />
							</svg>
							<span class="hidden sm:inline">{{ language === 'en' ? 'Support Us' : '支持我们'}}</span>
							<span class="sm:hidden">{{ language === 'en' ? 'Donate' : '捐赠'}}</span>
						</a>
						<button @click="toggleLanguage()"
							class="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
							{{ language === 'en' ? '中文' : 'English'}}
						</button>
					</nav>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-grow mx-auto px-4 pt-24 pb-12">
			<!-- Hero Section -->
			<section class="mb-16 text-center">
				<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
					{{ language === 'en' ? 'Master Your' : '掌握你的'}} <span
						class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{{ language === 'en' ? 'Pronunciation' : '朗读技巧'}}</span>
				</h1>
				<p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
					{{ language === 'en' ? 'The most advanced speech recognition platform for language learners' : '专为语言学习者打造的最先进语音识别平台'}}
				</p>

			</section>

			<!-- Content Section - Vertical Layout -->
			<section class="mb-16">
				<div class="bg-white rounded-xl shadow-md overflow-hidden">
					<div class="p-6 md:p-8">
						<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
							{{ language === 'en' ? 'Why Choose Our Platform?' : '平台优势'}}</h2>
						<div class="space-y-4">
							<p class="text-gray-600">
								{{ language === 'en' ? 'Our cutting-edge technology provides real-time feedback on your pronunciation, helping you sound like a native speaker faster than ever before.' : '我们的尖端技术实时反馈您的发音，帮助您比以往更快达到母语水平。'}}
							</p>
							<p class="text-gray-600">
								{{ language === 'en' ? "With personalized exercises and progress tracking, you'll see measurable improvement in your speaking skills." : "通过个性化练习和进度跟踪，您的口语能力将获得显著提升。"}}
							</p>
						</div>
						<button @click="navigateToPracticeAim"
							class="mt-6 w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
							{{ language === 'en' ? 'Start Practicing' : '立即体验'}}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</section>

			<!-- Learning Modes - Vertical Stack on Mobile -->
			<section class="mb-16">
				<h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
					{{ language === 'en' ? 'Learning Modes' : '学习模式'}}</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div v-for="(mode, index) in (language === 'en' ? modes : modesCn)" :key="index"
						@click="navigateToMode(mode.route,mode.gamemode,mode.timemode)"
						class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
						<div class="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
							<div class="text-white text-4xl">
								{{ mode.icon }}
							</div>
						</div>
						<div class="p-5">
							<h3 class="text-xl font-bold text-gray-800 mb-2">{{ mode.name }}</h3>
							<p class="text-gray-600 text-sm">{{ mode.description }}</p>
						</div>
					</div>
				</div>
			</section>



			<!-- How It Works Section -->
			<section class="mb-16" ref="aboutWork">
				<h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
					{{ language === 'en' ? 'How It Works' : '工作原理'}}</h2>

				<div class="space-y-12">
					<div v-for="(item, index) in (language === 'en' ? aboutContent : aboutContentCn)" :key="index"
						class="bg-white rounded-xl shadow-md overflow-hidden">
						<div class="md:flex">
							<div class="md:w-1/2 p-4">
								<img :src="item.image" alt="How it works"
									class="w-full h-auto object-cover rounded-lg" />
							</div>
							<div class="md:w-1/2 p-6 flex items-center">
								<p class="text-gray-700">
									{{ item.text }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<footer class="bg-gray-900 text-white py-8">
			<div class="container mx-auto px-4">
				<div class="flex flex-col md:flex-row justify-between items-center">
					<div class="mb-4 md:mb-0 text-center md:text-left">
						<h3 class="text-xl font-bold mb-1">SpeechMaster</h3>
						<p class="text-gray-400 text-sm">
							{{ language === "en" ? 'Perfect your pronunciation with AI' : '用人工智能技术完善您的发音'}}
							</p>
					</div>

					<div class="flex space-x-4">
						<a href="#"
							class="text-gray-400 hover:text-white transition-colors text-sm">{{ language === 'en' ? 'Terms' : '服务条款'}}</a>
						<a href="#"
							class="text-gray-400 hover:text-white transition-colors text-sm">{{ language === 'en' ? 'Privacy' : '隐私政策'}}</a>
						<a href="#"
							class="text-gray-400 hover:text-white transition-colors text-sm">{{ language === 'en' ? 'Contact' : '联系我们'}}</a>
					</div>
				</div>

				<div class="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-xs">
					<p>© 2023 SpeechMaster. All rights reserved.</p>
					<p>版权所有 © 2023 SpeechMaster。保留所有权利。</p>
				</div>
			</div>
		</footer>
	</div>
</template>



<script>
	export default {
		name: 'Index',
		data() {
			return {
				scrollOffset: 0,
				startX: 0,
				isDragging: false,
				activeModeIndex: 0,
				modes: [{
						name: "Practice Easy Mode",
						icon: "🎤",
						description: "Improve your pronunciation with guided exercises",
						route: "/pages/index/PracticeAim/PracticeAim",
						gamemode: "split",
						timemode: "30s"
					},
					{
						name: "Level Up Mode",
						icon: "🎤",
						description: "Improve your pronunciation with guided exercises",
						route: "/pages/index/PracticeAim/PracticeAim",
						gamemode: "split",
						timemode: "1min"
					},
					{
						name: "Long~ Mode",
						icon: "🎤",
						description: "Improve your pronunciation with guided exercises",
						route: "/pages/index/PracticeAim/PracticeAim",
						gamemode: "split",
						timemode: "long"
					},
					{
						name: "Test Mode",
						icon: "📝",
						description: "Evaluate your progress with assessments",
						route: "/pages/index/MedicAim/MedicAim"
					},
					{
						name: "Challenge Mode",
						icon: "🏆",
						description: "Compete with others in pronunciation challenges",
						route: "/pages/index/PracticeAim/PracticeAim",
						gamemode: "full",
						timemode: "1min"
					},
					{
						name: "Full Text Mode",
						icon: "💬",
						description: "Practice real-life dialogues with AI",
						route: "/pages/index/PracticeAim/PracticeAim",
						gamemode: "full",
						timemode: "long"
					}
				],
				aboutContent: [{
						image: "/static/step1.jpg",
						text: "Our advanced speech recognition technology analyzes your pronunciation in real-time, providing instant feedback on accuracy, fluency, and intonation."
					},
					{
						image: "/static/step2.jpg",
						text: "Personalized learning paths adapt to your skill level and learning style, ensuring you make progress at the optimal pace for you."
					},
					{
						image: "/static/step3.jpg",
						text: "Track your improvement over time with detailed analytics and progress reports that highlight your strengths and areas for improvement."
					}
				],
				modesCn: [{
					name: "轻松练习模式",
					icon: "🎤",
					description: "通过指导练习改善发音",
					route: "/pages/index/PracticeAim/PracticeAim",
					gamemode: "split",
					timemode: "30s"
				}, {
					name: "升级模式",
					icon: "🎤",
					description: "通过进阶练习提升发音水平",
					route: "/pages/index/PracticeAim/PracticeAim",
					gamemode: "split",
					timemode: "1min"
				}, {
					name: "长时间模式",
					icon: "🎤",
					description: "进行深度持久的发音训练",
					route: "/pages/index/PracticeAim/PracticeAim",
					gamemode: "split",
					timemode: "long"
				}, {
					name: "测试模式",
					icon: "📝",
					description: "定期评估您的进步",
					route: "/pages/index/MedicAim/MedicAim"
				}, {
					name: "挑战模式",
					icon: "🏆",
					description: "与其他学习者进行发音比拼",
					route: "/pages/index/PracticeAim/PracticeAim",
					gamemode: "full",
					timemode: "1min"
				}, {
					name: "全文模式",
					icon: "💬",
					description: "通过完整对话提升实战能力",
					route: "/pages/index/PracticeAim/PracticeAim",
					gamemode: "full",
					timemode: "long"
				}],
				aboutContentCn: [{
					image: "/static/step1.jpg",
					text: "我们的语音识别技术实时分析发音，即时反馈准确性、流利度和语调"
				}, {
					image: "/static/step2.jpg",
					text: "个性化学习路径根据您的水平和学习风格动态调整"
				}, {
					image: "/static/step3.jpg",
					text: "详细的数据分析助您清晰了解进步轨迹"
				}],
				language: 'en'
			}
	},
	methods: {
		navigateToHome() {
			uni.navigateTo({
				url: '/pages/index/index',
			});
		},
		navigateToPracticeAim() {
			uni.navigateTo({
				url: '/pages/index/PracticeAim/PracticeAim',
			});
		},

		navigateToMode(route, gamemode, timemode) {
			uni.navigateTo({
				url: `${route}?gameMode=${gamemode}&timeMode=${timemode}`,
			});
			console.log(route);
		},
		scrollToAbout() {
			this.$refs.aboutWork.scrollIntoView({
				behavior: 'smooth'
			});
		},
		handleTouchStart(e) {
			this.startX = e.touches[0].clientX
			this.isDragging = true
		},
		handleTouchMove(e) {
			if (!this.isDragging) return
			const x = e.touches[0].clientX
			const walk = x - this.startX
			this.scrollOffset += walk / 3
			this.startX = x

			// Update active mode indicator
			const containerWidth = document.querySelector('.mode-scroll-container').offsetWidth
			const scrollPercentage = Math.abs(this.scrollOffset) / (this.modes.length * 288 - containerWidth)
			this.activeModeIndex = Math.floor(scrollPercentage * (this.modes.length - 1))
		},
		handleTouchEnd() {
			this.isDragging = false

			// Snap to nearest card
			const cardWidth = 288 // 72rem = 288px
			const snappedOffset = Math.round(this.scrollOffset / cardWidth) * cardWidth
			const maxOffset = -((this.modes.length - 1) * cardWidth)

			this.scrollOffset = Math.max(maxOffset, Math.min(0, snappedOffset))
		},
		toggleLanguage() {
			this.language = this.language === 'en' ? 'zh' : 'en';
		},
	},
	};
</script>

<style scoped>
	@import url("../css/style.css");

	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Smooth scrolling behavior */
	html {
		scroll-behavior: smooth;
	}

	/* Responsive font sizes */
	@media (max-width: 640px) {
		.text-5xl {
			font-size: 2.25rem;
			line-height: 2.5rem;
		}

		.text-4xl {
			font-size: 1.875rem;
			line-height: 2.25rem;
		}
	}

	/* Ensure full height layout */
	.min-h-screen {
		min-height: 100vh;
	}

	.animate-fade-in {
		animation: fade-in 0.8s ease-out forwards;
	}

	.animate-fade-in-up {
		animation: fade-in 0.8s ease-out 0.1s forwards;
	}

	.delay-100 {
		animation-delay: 0.1s;
	}

	/* Smooth transitions for mode cards */
	.mode-card {
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.mode-card:hover {
		transform: translateY(-8px);
	}

	/* Custom scrollbar for mode container */
	.mode-scroll-container {
		scrollbar-width: none;
		/* Firefox */
		-ms-overflow-style: none;
		/* IE/Edge */
	}

	.mode-scroll-container::-webkit-scrollbar {
		display: none;
		/* Chrome/Safari */
	}
</style>