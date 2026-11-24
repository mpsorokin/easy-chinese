export type ReadingLine = {
  zh: string;
  tokens: readonly string[];
  pinyin: string;
  en: string;
  spoken?: string;
};

export type ReadingStory = {
  id: string;
  titleZh: string;
  titleEn: string;
  titlePinyin: string;
  lessons?: readonly [first: number, last: number];
  lines: readonly ReadingLine[];
};

type StorySource = Omit<ReadingStory, 'lines'> & {
  lines: readonly (Omit<ReadingLine, 'zh' | 'tokens'> & {
    segmented: string;
  })[];
};

// Keep the word boundaries in the teaching material so compounds, names and
// punctuation stay consistent across devices.
const stories: readonly StorySource[] = [
  {
    id: 'my-new-friend',
    titleZh: '我的新朋友',
    titleEn: 'My New Friend',
    titlePinyin: 'Wǒ de xīn péngyou',
    lessons: [1, 3],
    lines: [
      {
        segmented: '今天|是|星期一|。',
        pinyin: 'Jīntiān shì xīngqīyī.',
        en: 'Today is Monday.',
      },
      {
        segmented: '安娜|是|法国|人|。',
        pinyin: 'Ānnà shì Fǎguó rén.',
        en: 'Anna is French.',
      },
      {
        segmented: '她|在|中国|学习|中文|。',
        pinyin: 'Tā zài Zhōngguó xuéxí Zhōngwén.',
        en: 'She studies Chinese in China.',
      },
      {
        segmented: '她|的|中文|老师|叫|王明|。',
        pinyin: 'Tā de Zhōngwén lǎoshī jiào Wáng Míng.',
        en: 'Her Chinese teacher is called Wang Ming.',
      },
      {
        segmented: '王|老师|有|二十|个|学生|。',
        pinyin: 'Wáng lǎoshī yǒu èrshí ge xuéshēng.',
        en: 'Teacher Wang has twenty students.',
      },
      {
        segmented: '安娜|的|同学|李月|也|是|她|的|朋友|。',
        pinyin: 'Ānnà de tóngxué Lǐ Yuè yě shì tā de péngyou.',
        en: 'Anna’s classmate Li Yue is also her friend.',
      },
      {
        segmented: '今天|她们|都|很|忙|。',
        pinyin: 'Jīntiān tāmen dōu hěn máng.',
        en: 'They are both very busy today.',
      },
      {
        segmented: '下课|以后|，|安娜|想|去|超市|买|一些|东西|。',
        pinyin: 'Xiàkè yǐhòu, Ānnà xiǎng qù chāoshì mǎi yìxiē dōngxi.',
        en: 'After class, Anna wants to go to the supermarket to buy a few things.',
      },
      {
        segmented: '李月|问|：“|你|想|买|什么|？”',
        pinyin: 'Lǐ Yuè wèn: “Nǐ xiǎng mǎi shénme?”',
        en: 'Li Yue asks, “What do you want to buy?”',
      },
      {
        segmented: '安娜|说|：“|我|想|买|牛奶|和|面条儿|。”',
        pinyin: 'Ānnà shuō: “Wǒ xiǎng mǎi niúnǎi hé miàntiáor.”',
        en: 'Anna says, “I want to buy milk and noodles.”',
      },
    ],
  },
  {
    id: 'sunday-with-my-family',
    titleZh: '星期天和我的家人',
    titleEn: 'Sunday with My Family',
    titlePinyin: 'Xīngqītiān hé wǒ de jiārén',
    lessons: [3, 5],
    lines: [
      {
        segmented: '我|家|有|五|口|人|：|爸爸|、|妈妈|、|哥哥|、|妹妹|和|我|。',
        pinyin: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.',
        en: 'There are five people in my family: Dad, Mom, my older brother, my younger sister, and me.',
      },
      {
        segmented: '爸爸|在|学校|工作|，|他|是|老师|。',
        pinyin: 'Bàba zài xuéxiào gōngzuò, tā shì lǎoshī.',
        en: 'Dad works at a school. He is a teacher.',
      },
      {
        segmented: '妈妈|会|做|中国|菜|，|她|做|的|菜|很|好吃|。',
        pinyin: 'Māma huì zuò Zhōngguó cài, tā zuò de cài hěn hǎochī.',
        en: 'Mom can cook Chinese food. The dishes she makes are delicious.',
      },
      {
        segmented: '哥哥|今年|二十五|岁|，|他|正在|学习|中文|。',
        pinyin: 'Gēge jīnnián èrshíwǔ suì, tā zhèngzài xuéxí Zhōngwén.',
        en: 'My older brother is twenty-five this year. He is studying Chinese.',
      },
      {
        segmented: '妹妹|还|没有|工作|，|她|是|学生|。',
        pinyin: 'Mèimei hái méiyǒu gōngzuò, tā shì xuéshēng.',
        en: 'My younger sister doesn’t have a job yet. She is a student.',
      },
      {
        segmented: '星期天|，|我们|都|不|上班|。',
        pinyin: 'Xīngqītiān, wǒmen dōu bú shàngbān.',
        en: 'On Sundays, none of us go to work.',
      },
      {
        segmented: '我们|喜欢|在|家|一起|吃|晚饭|。',
        pinyin: 'Wǒmen xǐhuan zài jiā yìqǐ chī wǎnfàn.',
        en: 'We like to have dinner together at home.',
      },
      {
        segmented: '昨天|妈妈|做|了|米饭|和|包子|。',
        pinyin: 'Zuótiān māma zuò le mǐfàn hé bāozi.',
        en: 'Yesterday, Mom made rice and steamed buns.',
      },
      {
        segmented: '哥哥|吃|了|三|个|包子|，|我|吃|了|两|个|。',
        pinyin: 'Gēge chī le sān ge bāozi, wǒ chī le liǎng ge.',
        en: 'My older brother ate three buns, and I ate two.',
      },
    ],
  },
  {
    id: 'dinner-tomorrow',
    titleZh: '明天我们一起吃饭',
    titleEn: 'Dinner Tomorrow',
    titlePinyin: 'Míngtiān wǒmen yìqǐ chīfàn',
    lessons: [5, 6],
    lines: [
      {
        segmented: '星期六|晚上|，|我|想|给|朋友|李月|打电话|。',
        pinyin: 'Xīngqīliù wǎnshang, wǒ xiǎng gěi péngyou Lǐ Yuè dǎ diànhuà.',
        en: 'On Saturday evening, I wanted to call my friend Li Yue.',
      },
      {
        segmented: '她|现在|很|忙|，|正在|超市|买|东西|。',
        pinyin: 'Tā xiànzài hěn máng, zhèngzài chāoshì mǎi dōngxi.',
        en: 'She was busy shopping at the supermarket.',
      },
      {
        segmented: '我|问|她|：“|你|明天|想|去|哪儿|？”',
        pinyin: 'Wǒ wèn tā: “Nǐ míngtiān xiǎng qù nǎr?”',
        en: 'I asked her, “Where do you want to go tomorrow?”',
      },
      {
        segmented: '她|说|：“|我|想|去|中国|饭馆|吃饭|。”',
        pinyin: 'Tā shuō: “Wǒ xiǎng qù Zhōngguó fànguǎn chī fàn.”',
        en: 'She said, “I want to eat at a Chinese restaurant.”',
      },
      {
        segmented: '我|不|会|开车|，|所以|我|想|坐|出租车|去|。',
        pinyin: 'Wǒ bú huì kāichē, suǒyǐ wǒ xiǎng zuò chūzūchē qù.',
        en: 'I can’t drive, so I wanted to take a taxi.',
      },
      {
        segmented: '李月|说|：“|可以|，|我们|星期天|六|点|见|。”',
        pinyin: 'Lǐ Yuè shuō: “Kěyǐ, wǒmen xīngqītiān liù diǎn jiàn.”',
        en: 'Li Yue said, “Okay, let’s meet at six on Sunday.”',
      },
      {
        segmented: '星期天|，|我们|都|休息|。',
        pinyin: 'Xīngqītiān, wǒmen dōu xiūxi.',
        en: 'We both had Sunday off.',
      },
      {
        segmented: '我们|一起|去|饭馆|，|吃|了|米饭|和|包子|。',
        pinyin: 'Wǒmen yìqǐ qù fànguǎn, chī le mǐfàn hé bāozi.',
        en: 'We went to the restaurant together and had rice and steamed buns.',
      },
      {
        segmented: '那|家|饭馆|的|菜|非常|好吃|。',
        pinyin: 'Nà jiā fànguǎn de cài fēicháng hǎochī.',
        en: 'The food at that restaurant was delicious.',
      },
    ],
  },
  {
    id: 'an-expensive-phone',
    titleZh: '一个太贵的手机',
    titleEn: 'A Phone That Is Too Expensive',
    titlePinyin: 'Yí ge tài guì de shǒujī',
    lessons: [4, 6],
    lines: [
      {
        segmented: '昨天|是|星期六|。',
        pinyin: 'Zuótiān shì xīngqīliù.',
        en: 'Yesterday was Saturday.',
      },
      {
        segmented: '王明|去|超市|买|东西|。',
        pinyin: 'Wáng Míng qù chāoshì mǎi dōngxi.',
        en: 'Wang Ming went to the supermarket to buy some things.',
      },
      {
        segmented: '超市|旁边|有|一|家|手机|店|。',
        pinyin: 'Chāoshì pángbiān yǒu yì jiā shǒujī diàn.',
        en: 'There was a phone shop next to the supermarket.',
      },
      {
        segmented: '店|里|有|很|多|新|手机|。',
        pinyin: 'Diàn lǐ yǒu hěn duō xīn shǒujī.',
        en: 'The shop had lots of new phones.',
      },
      {
        segmented: '王明|喜欢|一|个|黑色|的|手机|。',
        pinyin: 'Wáng Míng xǐhuan yí ge hēisè de shǒujī.',
        en: 'Wang Ming liked a black phone.',
      },
      {
        segmented: '这个|手机|很|漂亮|，|但是|太|贵|了|。',
        pinyin: 'Zhège shǒujī hěn piàoliang, dànshì tài guì le.',
        en: 'The phone looked nice, but it was too expensive.',
      },
      {
        segmented: '他|没有|那么|多|钱|，|所以|没有|买|。',
        pinyin: 'Tā méiyǒu nàme duō qián, suǒyǐ méiyǒu mǎi.',
        en: 'He didn’t have that much money, so he didn’t buy it.',
      },
      {
        segmented:
          '他|给|姐姐|打电话|，|问|：“|你|知道|哪里|有|便宜|一点|的|手机|吗|？”',
        pinyin:
          'Tā gěi jiějie dǎ diànhuà, wèn: “Nǐ zhīdào nǎlǐ yǒu piányi yìdiǎn de shǒujī ma?”',
        en: 'He called his older sister and asked, “Do you know where I can find a cheaper phone?”',
      },
      {
        segmented: '姐姐|说|：“|我|知道|一|家|店|。',
        pinyin: 'Jiějie shuō: “Wǒ zhīdào yì jiā diàn.',
        en: 'His sister said, “I know a shop.',
      },
      {
        segmented: '我们|明天|一起|去|吧|！”',
        pinyin: 'Wǒmen míngtiān yìqǐ qù ba!”',
        en: 'Let’s go together tomorrow!”',
      },
    ],
  },
  {
    id: 'today-at-the-supermarket',
    titleZh: '今天我们去超市',
    titleEn: 'Today We’re Going to the Supermarket',
    titlePinyin: 'Jīntiān wǒmen qù chāoshì',
    lessons: [6, 7],
    lines: [
      {
        segmented: '今天|早上|，|我|和|哥哥|在|家|学|汉语|。',
        pinyin: 'Jīntiān zǎoshang, wǒ hé gēge zài jiā xué Hànyǔ.',
        en: 'This morning, my older brother and I are studying Chinese at home.',
      },
      {
        segmented: '妈妈|不|在|家|。',
        pinyin: 'Māma bú zài jiā.',
        en: "Mom isn't at home.",
      },
      {
        segmented: '我|问|爸爸|：“|妈妈|在|哪儿|？”',
        pinyin: 'Wǒ wèn bàba: “Māma zài nǎr?”',
        en: 'I ask Dad, “Where is Mom?”',
      },
      {
        segmented: '爸爸|说|：“|她|在|超市|等|你们|。”',
        pinyin: 'Bàba shuō: “Tā zài chāoshì děng nǐmen.”',
        en: "Dad says, “She's waiting for you at the supermarket.”",
      },
      {
        segmented: '哥哥|问|：“|她|为什么|等|我们|？”',
        pinyin: 'Gēge wèn: “Tā wèishénme děng wǒmen?”',
        en: 'My older brother asks, “Why is she waiting for us?”',
      },
      {
        segmented: '爸爸|说|：“|因为|她|买|了|很|多|水果|。”',
        pinyin: 'Bàba shuō: “Yīnwèi tā mǎi le hěn duō shuǐguǒ.”',
        en: 'Dad says, “Because she bought a lot of fruit.”',
      },
      {
        segmented: '我|说|：“|那|我们|现在|去|吧|！”',
        pinyin: 'Wǒ shuō: “Nà wǒmen xiànzài qù ba!”',
        en: "I say, “Then let's go now!”",
      },
      {
        segmented: '我|和|哥哥|一起|去|超市|。',
        pinyin: 'Wǒ hé gēge yìqǐ qù chāoshì.',
        en: 'My older brother and I go to the supermarket together.',
      },
      {
        segmented: '妈妈|说|：“|你们|来|了|！',
        pinyin: 'Māma shuō: “Nǐmen lái le!',
        en: "Mom says, “You're here!",
      },
      {
        segmented: '水果|太|重|了|。”',
        pinyin: 'Shuǐguǒ tài zhòng le.”',
        en: 'The fruit is too heavy.”',
      },
      {
        segmented: '我|问|：“|妈妈|，|我们|能|帮|你|吗|？”',
        pinyin: 'Wǒ wèn: “Māma, wǒmen néng bāng nǐ ma?”',
        en: 'I ask, “Mom, can we help you?”',
      },
      {
        segmented: '妈妈|说|：“|可以|！',
        pinyin: 'Māma shuō: “Kěyǐ!',
        en: 'Mom says, “Yes!',
      },
      {
        segmented: '谢谢|你们|！”',
        pinyin: 'Xièxie nǐmen!”',
        en: 'Thank you!”',
      },
      {
        segmented: '我|拿|苹果|，|哥哥|拿|香蕉|。',
        pinyin: 'Wǒ ná píngguǒ, gēge ná xiāngjiāo.',
        en: 'I carry the apples, and my older brother carries the bananas.',
      },
      {
        segmented: '我们|一起|回家|。',
        pinyin: 'Wǒmen yìqǐ huí jiā.',
        en: 'We go home together.',
      },
      {
        segmented: '爸爸|问|：“|你们|买|了|什么|？”',
        pinyin: 'Bàba wèn: “Nǐmen mǎi le shénme?”',
        en: 'Dad asks, “What did you buy?”',
      },
      {
        segmented: '哥哥|说|：“|我们|买|了|苹果|和|香蕉|！”',
        pinyin: 'Gēge shuō: “Wǒmen mǎi le píngguǒ hé xiāngjiāo!”',
        en: 'My older brother says, “We bought apples and bananas!”',
      },
      {
        segmented: '大家|都|很|高兴|。',
        pinyin: 'Dàjiā dōu hěn gāoxìng.',
        en: 'Everyone is happy.',
      },
    ],
  },
  {
    id: 'lets-go-to-the-supermarket',
    titleZh: '我们去超市！',
    titleEn: 'Let’s Go to the Supermarket!',
    titlePinyin: 'Wǒmen qù chāoshì!',
    lessons: [6, 7],
    lines: [
      {
        segmented: '今天|早上|，|我|和|哥哥|在|家|学|汉语|。',
        pinyin: 'Jīntiān zǎoshang, wǒ hé gēge zài jiā xué Hànyǔ.',
        en: 'This morning, my older brother and I were studying Chinese at home.',
      },
      {
        segmented: '妈妈|说|：“|今天|我们|去|超市|买|水果|。”',
        pinyin: 'Māma shuō: “Jīntiān wǒmen qù chāoshì mǎi shuǐguǒ.”',
        en: 'Mom said, “Today we’re going to the supermarket to buy fruit.”',
      },
      {
        segmented: '哥哥|问|：“|我们|买|什么|？”',
        pinyin: 'Gēge wèn: “Wǒmen mǎi shénme?”',
        en: 'My older brother asked, “What are we going to buy?”',
      },
      {
        segmented: '我|说|：“|我|想|买|苹果|。”',
        pinyin: 'Wǒ shuō: “Wǒ xiǎng mǎi píngguǒ.”',
        en: 'I said, “I want to buy apples.”',
      },
      {
        segmented: '哥哥|说|：“|我|想|买|香蕉|。”',
        pinyin: 'Gēge shuō: “Wǒ xiǎng mǎi xiāngjiāo.”',
        en: 'My older brother said, “I want to buy bananas.”',
      },
      {
        segmented: '爸爸|问|：“|你们|带|钱包|了|吗|？”',
        pinyin: 'Bàba wèn: “Nǐmen dài qiánbāo le ma?”',
        en: 'Dad asked, “Did you bring your wallet?”',
      },
      {
        segmented: '妈妈|说|：“|带|了|！”',
        pinyin: 'Māma shuō: “Dài le!”',
        en: 'Mom said, “Yes, we did!”',
      },
      {
        segmented: '我们|一起|去|超市|。',
        pinyin: 'Wǒmen yìqǐ qù chāoshì.',
        en: 'We went to the supermarket together.',
      },
      {
        segmented: '在|超市|，|我|看见|一|个|字|。',
        pinyin: 'Zài chāoshì, wǒ kànjiàn yí ge zì.',
        en: 'At the supermarket, I saw a character.',
      },
      {
        segmented: '我|问|哥哥|：“|这|是|什么|字|？”',
        pinyin: 'Wǒ wèn gēge: “Zhè shì shénme zì?”',
        en: 'I asked my brother, “What character is this?”',
      },
      {
        segmented: '哥哥|说|：“|这|是|‘|果|’，|水果|的|‘|果|’。”',
        pinyin: 'Gēge shuō: “Zhè shì ‘guǒ’, shuǐguǒ de ‘guǒ’.”',
        en: 'He said, “This is 果, the 果 in 水果, meaning ‘fruit.’”',
      },
      {
        segmented: '我|说|：“|这个|字|我|认识|！”',
        pinyin: 'Wǒ shuō: “Zhège zì wǒ rènshi!”',
        en: 'I said, “I know this character!”',
      },
      {
        segmented: '哥哥|问|：“|那|‘|香|’|怎么|读|？”',
        pinyin: 'Gēge wèn: “Nà ‘xiāng’ zěnme dú?”',
        en: 'He asked, “Then how do you read 香?”',
      },
      {
        segmented: '我|说|：“|我|不|知道|。”',
        pinyin: 'Wǒ shuō: “Wǒ bù zhīdào.”',
        en: 'I said, “I don’t know.”',
      },
      {
        segmented: '哥哥|说|：“|读| xiāng|，|香蕉|的|‘|香|’。”',
        pinyin: 'Gēge shuō: “Dú xiāng, xiāngjiāo de ‘xiāng’.”',
        en: 'He said, “It’s read xiāng, like the 香 in 香蕉, meaning ‘banana.’”',
        spoken: '哥哥说：“读香，香蕉的‘香’。”',
      },
      {
        segmented: '我|说|：“|我|现在|认识|两|个|字|了|！”',
        pinyin: 'Wǒ shuō: “Wǒ xiànzài rènshi liǎng ge zì le!”',
        en: 'I said, “Now I know two characters!”',
      },
      {
        segmented: '妈妈|笑|了|：“|你们|想|买|水果|，|还是|想|学|汉语|？”',
        pinyin:
          'Māma xiào le: “Nǐmen xiǎng mǎi shuǐguǒ, háishi xiǎng xué Hànyǔ?”',
        en: 'Mom laughed, “Do you want to buy fruit or study Chinese?”',
      },
      {
        segmented: '我们|说|：“|都|想|！”',
        pinyin: 'Wǒmen shuō: “Dōu xiǎng!”',
        en: 'We said, “Both!”',
      },
      {
        segmented: '我们|买|了|苹果|和|香蕉|。',
        pinyin: 'Wǒmen mǎi le píngguǒ hé xiāngjiāo.',
        en: 'We bought apples and bananas.',
      },
    ],
  },
];

export const readingStories: readonly ReadingStory[] = stories.map((story) => ({
  ...story,
  lines: story.lines.map(({ segmented, ...line }) => ({
    ...line,
    zh: segmented.replaceAll('|', ''),
    tokens: segmented.split('|'),
  })),
}));

export function storiesForLesson(lesson: number): readonly ReadingStory[] {
  return readingStories.filter(
    ({ lessons }) => lessons && lesson >= lessons[0] && lesson <= lessons[1],
  );
}
