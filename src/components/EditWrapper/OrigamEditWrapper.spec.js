import { mount } from '@vue/test-utils';
import Origameditorwrapper from './OrigamEditWrapper.vue';

describe('Spec Origameditorwrapper', function () {
	it('mounts', () => {
		const wrapper = mount(Origameditorwrapper);
		expect(wrapper)
			.toBeTruthy();
	});
});
