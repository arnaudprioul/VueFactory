import { mount } from '@vue/test-utils';
import Origameditorcssbox from './OrigamCssBox.vue';

describe('Spec Origameditorcssbox', function () {
	it('mounts', () => {
		const wrapper = mount(Origameditorcssbox);
		expect(wrapper)
			.toBeTruthy();
	});
});
