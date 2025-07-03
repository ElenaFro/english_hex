<template>
    <div class="popup-container">
        <div class="popup">
            <h2 class="popup__header" >Поздравляю</h2>
            <p class="popup__message">Вы завершили первую колоду, теперь давайте создадим свою планету!</p>
            <div class="popup-actions">
                <slot name="actions">
                    <button class="button button--purple" @click="goToNext">
                        Дальше <img src="@/assets/icons/arrow_right.svg" alt="arrow_right">
                    </button>
                </slot>
            </div>
        </div>
		<div class="img-container">
			<div class="img-container__girl-container">
				<img src="@/assets/img/girl-flag.png" alt="girl" class="girl-img">
			</div>
			<div class="img-container__planet-container">
				<img class="planet-img" src="@/assets/img/planets/planet-img 1.png" alt="">
			</div>
		</div>
    </div>
</template>

<script setup>
const emit = defineEmits([ "goToMain" ]);

const goToNext = () => {
	emit('goToMain', 'goToMain')
}

</script>

<style scoped lang="scss">
.popup-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	position: relative;

	.popup {
		margin: 0;
		&__header {
			text-align: center;
			margin-bottom: 12px;
		}

		&__message {
			font-size: 18px;
			font-weight: 400;
			line-height: 120%;
			text-align: left;
			margin-bottom: 30px;
		}
		
		.button {
			position: relative;
			z-index: 1000;
		}
	}

	.img-container {
		position: relative;
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;

		&__girl-container {
			width: 228px;
			height: 350px;
			position: absolute;
			z-index: 2;
			bottom: 70px;
			transform: translateX(-100%);
			left: 95%;

			.girl-img {
				height: 100%;
			}
		}

		&__planet-container {
			width: 400px;
			height: 400px;
			position: absolute;
			top: 110%;
			transform: translateY(-50%);
			z-index: 1;

			.planet-img {
				width: 400px;
				height: 400px;
			}
		}
	}
}
</style>