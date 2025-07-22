<template>
	<div class="origam-css-box">
		<div class="origam-css-box__wrapper">
			<div class="origam-css-box__header">
				<origam-title
						class="origam-css-box__title"
						tag="h3"
				>CSS box
				</origam-title>
			</div>

			<div class="origam-css-box__content">
				<div class="origam-css-box__box origam-css-box__box--margin">
					<origam-label
							class="origam-css-box__label"
							color="#2c2c2c"
							text="Margin"
					/>

					<input
							v-model="margin.top"
							class="origam-css-box__input origam-css-box__input--block origam-css-box__input--top"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.right"
							class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--right"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.bottom"
							class="origam-css-box__input origam-css-box__input--block origam-css-box__input--bottom"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.left"
							class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--left"
							placeholder="-"
							type="number"
					/>

					<div class="origam-css-box__box origam-css-box__box--border">
						<origam-label
								class="origam-css-box__label"
								color="#2c2c2c"
								text="Border"
						/>

						<input
								v-model="border.top"
								class="origam-css-box__input origam-css-box__input--block origam-css-box__input--top"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.right"
								class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--right"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.bottom"
								class="origam-css-box__input origam-css-box__input--block origam-css-box__input--bottom"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.left"
								class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--left"
								placeholder="-"
								type="number"
						/>

						<div class="origam-css-box__box origam-css-box__box--padding">
							<origam-label
									class="origam-css-box__label"
									color="#2c2c2c"
									text="Padding"
							/>

							<input
									v-model="padding.top"
									class="origam-css-box__input origam-css-box__input--block origam-css-box__input--top"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.right"
									class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--right"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.bottom"
									class="origam-css-box__input origam-css-box__input--block origam-css-box__input--bottom"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.left"
									class="origam-css-box__input origam-css-box__input--inline origam-css-box__input--left"
									placeholder="-"
									type="number"
							/>

							<div class="origam-css-box__text"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script
		lang="ts"
		setup
>
	import { OrigamLabel, OrigamTitle } from 'origam/components'
	import { useProps } from "origam/composables"

	import type { ICssBoxProps } from '../../interfaces'

	import { shallowRef, watch } from 'vue'

	// TODO - WIP

	const props = withDefaults(defineProps<ICssBoxProps>(), {})

	defineEmits(['update:padding', 'update:margin', 'update:border'])

	const {filterProps} = useProps<ICssBoxProps>(props)

	const margin = shallowRef({
		top: '',
		right: '',
		bottom: '',
		left: ''
	})
	const border = shallowRef({
		top: '',
		right: '',
		bottom: '',
		left: ''
	})
	const padding = shallowRef({
		top: '',
		right: '',
		bottom: '',
		left: ''
	})

	watch(() => props, () => {

	})

	// EXPOSE

	defineExpose({
		filterProps
	})
</script>

<style
		lang="scss"
		scoped
>
	.origam-css-box {
		&__box {
			padding: 44px;
			position: relative;

			&--margin {
				background-color: #ffffff;
				border: 1px dashed #bababa;
				margin: 1px;
			}

			&--border {
				background-color: #f6f6f6;
				border: 1px dashed #d7d7d7;
			}

			&--padding {
				background-color: #ebebeb;
				border: 1px dashed #bababa;
			}
		}

		&__label {
			font-size: 9px;
			line-height: 9px;

			position: absolute;
			top: 6px;
			left: 5px;

			margin: 0;
			padding: 0;
		}

		&__input {
			font-size: 11px;
			line-height: 11px;
			text-align: center;

			position: absolute;

			padding: 3px 0;
			margin: 0;

			height: 24px;
			width: 34px;

			border: 1px solid #bdbdbd;

			&--block {
				left: 50%;
				transform: translateX(-50%);
			}

			&--inline {
				top: 50%;
				transform: translateY(-50%);
			}

			&--top {
				top: 6px;

			}

			&--right {
				right: 4px;
			}

			&--bottom {
				bottom: 6px;
			}

			&--left {
				left: 6px;
			}
		}

		&__text {
			text-align: center;
			font-size: 10px;
			line-height: 11px;
			border: 1px solid #bababa;
			height: 50px;
			background-color: #8c8c8c;
		}
	}
</style>

<style>
	:root {

	}
</style>
