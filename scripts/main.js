//главный js файл проекта, тока входа приложения, сюда импортируем сущности из модулей

import Header from './Header.js';

import TabsCollection from './Tabs.js';

import VideoPlayerCollection from './VideoPlayer.js';

import ExpandableContentCollection from './ExpandableContent.js';

import InputMaskCollection from './InputMask.js';

import SelectCollection from './Select.js';

//инициализируем,запускаем классы
new Header();
new TabsCollection();
new VideoPlayerCollection();
new ExpandableContentCollection();
new InputMaskCollection();
new SelectCollection();
