export type ReadingLine = { zh: string; pinyin: string; en: string };

export type ReadingStory = {
  id: string;
  titleZh: string;
  titleEn: string;
  titlePinyin: string;
  lessons?: readonly [first: number, last: number];
  lines: readonly ReadingLine[];
};

// The Chinese and pinyin come from the original practice stories.
export const readingStories: readonly ReadingStory[] = [
  {
    id: 'my-new-friend',
    titleZh: '我的新朋友',
    titleEn: 'My New Friend',
    titlePinyin: 'Wǒ de xīn péngyou',
    lessons: [1, 3],
    lines: [
      {
        zh: '今天是星期一。',
        pinyin: 'Jīntiān shì xīngqīyī.',
        en: 'Today is Monday.',
      },
      {
        zh: '安娜是法国人。',
        pinyin: 'Ānnà shì Fǎguó rén.',
        en: 'Anna is French.',
      },
      {
        zh: '她在中国学习中文。',
        pinyin: 'Tā zài Zhōngguó xuéxí Zhōngwén.',
        en: 'She studies Chinese in China.',
      },
      {
        zh: '她的中文老师叫王明。',
        pinyin: 'Tā de Zhōngwén lǎoshī jiào Wáng Míng.',
        en: 'Her Chinese teacher is called Wang Ming.',
      },
      {
        zh: '王老师有二十个学生。',
        pinyin: 'Wáng lǎoshī yǒu èrshí ge xuéshēng.',
        en: 'Teacher Wang has twenty students.',
      },
      {
        zh: '安娜的同学李月也是她的朋友。',
        pinyin: 'Ānnà de tóngxué Lǐ Yuè yě shì tā de péngyou.',
        en: 'Anna’s classmate Li Yue is also her friend.',
      },
      {
        zh: '今天她们都很忙。',
        pinyin: 'Jīntiān tāmen dōu hěn máng.',
        en: 'They are both very busy today.',
      },
      {
        zh: '下课以后，安娜想去超市买一些东西。',
        pinyin: 'Xiàkè yǐhòu, Ānnà xiǎng qù chāoshì mǎi yìxiē dōngxi.',
        en: 'After class, Anna wants to go to the supermarket to buy a few things.',
      },
      {
        zh: '李月问：“你想买什么？”',
        pinyin: 'Lǐ Yuè wèn: “Nǐ xiǎng mǎi shénme?”',
        en: 'Li Yue asks, “What do you want to buy?”',
      },
      {
        zh: '安娜说：“我想买牛奶和面条儿。”',
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
        zh: '我家有五口人：爸爸、妈妈、哥哥、妹妹和我。',
        pinyin: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.',
        en: 'There are five people in my family: Dad, Mom, my older brother, my younger sister, and me.',
      },
      {
        zh: '爸爸在学校工作，他是老师。',
        pinyin: 'Bàba zài xuéxiào gōngzuò, tā shì lǎoshī.',
        en: 'Dad works at a school. He is a teacher.',
      },
      {
        zh: '妈妈会做中国菜，她做的菜很好吃。',
        pinyin: 'Māma huì zuò Zhōngguó cài, tā zuò de cài hěn hǎochī.',
        en: 'Mom can cook Chinese food. The dishes she makes are delicious.',
      },
      {
        zh: '哥哥今年二十五岁，他正在学习中文。',
        pinyin: 'Gēge jīnnián èrshíwǔ suì, tā zhèngzài xuéxí Zhōngwén.',
        en: 'My older brother is twenty-five this year. He is studying Chinese.',
      },
      {
        zh: '妹妹还没有工作，她是学生。',
        pinyin: 'Mèimei hái méiyǒu gōngzuò, tā shì xuéshēng.',
        en: 'My younger sister doesn’t have a job yet. She is a student.',
      },
      {
        zh: '星期天，我们都不上班。',
        pinyin: 'Xīngqītiān, wǒmen dōu bú shàngbān.',
        en: 'On Sundays, none of us go to work.',
      },
      {
        zh: '我们喜欢在家一起吃晚饭。',
        pinyin: 'Wǒmen xǐhuan zài jiā yìqǐ chī wǎnfàn.',
        en: 'We like to have dinner together at home.',
      },
      {
        zh: '昨天妈妈做了米饭和包子。',
        pinyin: 'Zuótiān māma zuò le mǐfàn hé bāozi.',
        en: 'Yesterday, Mom made rice and steamed buns.',
      },
      {
        zh: '哥哥吃了三个包子，我吃了两个。',
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
        zh: '星期六晚上，我想给朋友李月打电话。',
        pinyin: 'Xīngqīliù wǎnshang, wǒ xiǎng gěi péngyou Lǐ Yuè dǎ diànhuà.',
        en: 'On Saturday evening, I wanted to call my friend Li Yue.',
      },
      {
        zh: '她现在很忙，正在超市买东西。',
        pinyin: 'Tā xiànzài hěn máng, zhèngzài chāoshì mǎi dōngxi.',
        en: 'She was busy shopping at the supermarket.',
      },
      {
        zh: '我问她：“你明天想去哪儿？”',
        pinyin: 'Wǒ wèn tā: “Nǐ míngtiān xiǎng qù nǎr?”',
        en: 'I asked her, “Where do you want to go tomorrow?”',
      },
      {
        zh: '她说：“我想去中国饭馆吃饭。”',
        pinyin: 'Tā shuō: “Wǒ xiǎng qù Zhōngguó fànguǎn chī fàn.”',
        en: 'She said, “I want to eat at a Chinese restaurant.”',
      },
      {
        zh: '我不会开车，所以我想坐出租车去。',
        pinyin: 'Wǒ bú huì kāichē, suǒyǐ wǒ xiǎng zuò chūzūchē qù.',
        en: 'I can’t drive, so I wanted to take a taxi.',
      },
      {
        zh: '李月说：“可以，我们星期天六点见。”',
        pinyin: 'Lǐ Yuè shuō: “Kěyǐ, wǒmen xīngqītiān liù diǎn jiàn.”',
        en: 'Li Yue said, “Okay, let’s meet at six on Sunday.”',
      },
      {
        zh: '星期天，我们都休息。',
        pinyin: 'Xīngqītiān, wǒmen dōu xiūxi.',
        en: 'We both had Sunday off.',
      },
      {
        zh: '我们一起去饭馆，吃了米饭和包子。',
        pinyin: 'Wǒmen yìqǐ qù fànguǎn, chī le mǐfàn hé bāozi.',
        en: 'We went to the restaurant together and had rice and steamed buns.',
      },
      {
        zh: '那家饭馆的菜非常好吃。',
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
        zh: '昨天是星期六。',
        pinyin: 'Zuótiān shì xīngqīliù.',
        en: 'Yesterday was Saturday.',
      },
      {
        zh: '王明去超市买东西。',
        pinyin: 'Wáng Míng qù chāoshì mǎi dōngxi.',
        en: 'Wang Ming went to the supermarket to buy some things.',
      },
      {
        zh: '超市旁边有一家手机店。',
        pinyin: 'Chāoshì pángbiān yǒu yì jiā shǒujī diàn.',
        en: 'There was a phone shop next to the supermarket.',
      },
      {
        zh: '店里有很多新手机。',
        pinyin: 'Diàn lǐ yǒu hěn duō xīn shǒujī.',
        en: 'The shop had lots of new phones.',
      },
      {
        zh: '王明喜欢一个黑色的手机。',
        pinyin: 'Wáng Míng xǐhuan yí ge hēisè de shǒujī.',
        en: 'Wang Ming liked a black phone.',
      },
      {
        zh: '这个手机很漂亮，但是太贵了。',
        pinyin: 'Zhège shǒujī hěn piàoliang, dànshì tài guì le.',
        en: 'The phone looked nice, but it was too expensive.',
      },
      {
        zh: '他没有那么多钱，所以没有买。',
        pinyin: 'Tā méiyǒu nàme duō qián, suǒyǐ méiyǒu mǎi.',
        en: 'He didn’t have that much money, so he didn’t buy it.',
      },
      {
        zh: '他给姐姐打电话，问：“你知道哪里有便宜一点的手机吗？”',
        pinyin:
          'Tā gěi jiějie dǎ diànhuà, wèn: “Nǐ zhīdào nǎlǐ yǒu piányi yìdiǎn de shǒujī ma?”',
        en: 'He called his older sister and asked, “Do you know where I can find a cheaper phone?”',
      },
      {
        zh: '姐姐说：“我知道一家店。我们明天一起去吧！”',
        pinyin:
          'Jiějie shuō: “Wǒ zhīdào yì jiā diàn. Wǒmen míngtiān yìqǐ qù ba!”',
        en: 'His sister said, “I know a shop. Let’s go together tomorrow!”',
      },
    ],
  },
  {
    id: 'today-at-the-supermarket',
    titleZh: '今天我们去超市',
    titleEn: 'Today We’re Going to the Supermarket',
    titlePinyin: 'Jīntiān wǒmen qù chāoshì',
    lines: [
      {
        zh: '今天早上，我和哥哥在家学汉语。',
        pinyin: 'Jīntiān zǎoshang, wǒ hé gēge zài jiā xué Hànyǔ.',
        en: 'This morning, my older brother and I are studying Chinese at home.',
      },
      {
        zh: '妈妈不在家。',
        pinyin: 'Māma bú zài jiā.',
        en: "Mom isn't at home.",
      },
      {
        zh: '我问爸爸：“妈妈在哪儿？”',
        pinyin: 'Wǒ wèn bàba: “Māma zài nǎr?”',
        en: 'I ask Dad, “Where is Mom?”',
      },
      {
        zh: '爸爸说：“她在超市等你们。”',
        pinyin: 'Bàba shuō: “Tā zài chāoshì děng nǐmen.”',
        en: "Dad says, “She's waiting for you at the supermarket.”",
      },
      {
        zh: '哥哥问：“她为什么等我们？”',
        pinyin: 'Gēge wèn: “Tā wèishénme děng wǒmen?”',
        en: 'My older brother asks, “Why is she waiting for us?”',
      },
      {
        zh: '爸爸说：“因为她买了很多水果。”',
        pinyin: 'Bàba shuō: “Yīnwèi tā mǎi le hěn duō shuǐguǒ.”',
        en: 'Dad says, “Because she bought a lot of fruit.”',
      },
      {
        zh: '我说：“那我们现在去吧！”',
        pinyin: 'Wǒ shuō: “Nà wǒmen xiànzài qù ba!”',
        en: "I say, “Then let's go now!”",
      },
      {
        zh: '我和哥哥一起去超市。',
        pinyin: 'Wǒ hé gēge yìqǐ qù chāoshì.',
        en: 'My older brother and I go to the supermarket together.',
      },
      {
        zh: '妈妈说：“你们来了！水果太重了。”',
        pinyin: 'Māma shuō: “Nǐmen lái le! Shuǐguǒ tài zhòng le.”',
        en: "Mom says, “You're here! The fruit is too heavy.”",
      },
      {
        zh: '我问：“妈妈，我们能帮你吗？”',
        pinyin: 'Wǒ wèn: “Māma, wǒmen néng bāng nǐ ma?”',
        en: 'I ask, “Mom, can we help you?”',
      },
      {
        zh: '妈妈说：“可以！谢谢你们！”',
        pinyin: 'Māma shuō: “Kěyǐ! Xièxie nǐmen!”',
        en: 'Mom says, “Yes! Thank you!”',
      },
      {
        zh: '我拿苹果，哥哥拿香蕉。',
        pinyin: 'Wǒ ná píngguǒ, gēge ná xiāngjiāo.',
        en: 'I carry the apples, and my older brother carries the bananas.',
      },
      {
        zh: '我们一起回家。',
        pinyin: 'Wǒmen yìqǐ huí jiā.',
        en: 'We go home together.',
      },
      {
        zh: '爸爸问：“你们买了什么？”',
        pinyin: 'Bàba wèn: “Nǐmen mǎi le shénme?”',
        en: 'Dad asks, “What did you buy?”',
      },
      {
        zh: '哥哥说：“我们买了苹果和香蕉！”',
        pinyin: 'Gēge shuō: “Wǒmen mǎi le píngguǒ hé xiāngjiāo!”',
        en: 'My older brother says, “We bought apples and bananas!”',
      },
      {
        zh: '大家都很高兴。',
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
    lines: [
      {
        zh: '今天早上，我和哥哥在家学汉语。',
        pinyin: 'Jīntiān zǎoshang, wǒ hé gēge zài jiā xué Hànyǔ.',
        en: 'This morning, my older brother and I were studying Chinese at home.',
      },
      {
        zh: '妈妈说：“今天我们去超市买水果。”',
        pinyin: 'Māma shuō: “Jīntiān wǒmen qù chāoshì mǎi shuǐguǒ.”',
        en: 'Mom said, “Today we’re going to the supermarket to buy fruit.”',
      },
      {
        zh: '哥哥问：“我们买什么？”',
        pinyin: 'Gēge wèn: “Wǒmen mǎi shénme?”',
        en: 'My older brother asked, “What are we going to buy?”',
      },
      {
        zh: '我说：“我想买苹果。”',
        pinyin: 'Wǒ shuō: “Wǒ xiǎng mǎi píngguǒ.”',
        en: 'I said, “I want to buy apples.”',
      },
      {
        zh: '哥哥说：“我想买香蕉。”',
        pinyin: 'Gēge shuō: “Wǒ xiǎng mǎi xiāngjiāo.”',
        en: 'My older brother said, “I want to buy bananas.”',
      },
      {
        zh: '爸爸问：“你们带钱包了吗？”',
        pinyin: 'Bàba wèn: “Nǐmen dài qiánbāo le ma?”',
        en: 'Dad asked, “Did you bring your wallet?”',
      },
      {
        zh: '妈妈说：“带了！”',
        pinyin: 'Māma shuō: “Dài le!”',
        en: 'Mom said, “Yes, we did!”',
      },
      {
        zh: '我们一起去超市。',
        pinyin: 'Wǒmen yìqǐ qù chāoshì.',
        en: 'We went to the supermarket together.',
      },
      {
        zh: '在超市，我看见一个字。',
        pinyin: 'Zài chāoshì, wǒ kànjiàn yí ge zì.',
        en: 'At the supermarket, I saw a character.',
      },
      {
        zh: '我问哥哥：“这是什么字？”',
        pinyin: 'Wǒ wèn gēge: “Zhè shì shénme zì?”',
        en: 'I asked my brother, “What character is this?”',
      },
      {
        zh: '哥哥说：“这是‘果’，水果的‘果’。”',
        pinyin: 'Gēge shuō: “Zhè shì ‘guǒ’, shuǐguǒ de ‘guǒ’.”',
        en: 'He said, “This is 果, the 果 in 水果, meaning ‘fruit.’”',
      },
      {
        zh: '我说：“这个字我认识！”',
        pinyin: 'Wǒ shuō: “Zhège zì wǒ rènshi!”',
        en: 'I said, “I know this character!”',
      },
      {
        zh: '哥哥问：“那‘香’怎么读？”',
        pinyin: 'Gēge wèn: “Nà ‘xiāng’ zěnme dú?”',
        en: 'He asked, “Then how do you read 香?”',
      },
      {
        zh: '我说：“我不知道。”',
        pinyin: 'Wǒ shuō: “Wǒ bù zhīdào.”',
        en: 'I said, “I don’t know.”',
      },
      {
        zh: '哥哥说：“读 xiāng，香蕉的‘香’。”',
        pinyin: 'Gēge shuō: “Dú xiāng, xiāngjiāo de ‘xiāng’.”',
        en: 'He said, “It’s read xiāng, like the 香 in 香蕉, meaning ‘banana.’”',
      },
      {
        zh: '我说：“我现在认识两个字了！”',
        pinyin: 'Wǒ shuō: “Wǒ xiànzài rènshi liǎng ge zì le!”',
        en: 'I said, “Now I know two characters!”',
      },
      {
        zh: '妈妈笑了：“你们想买水果，还是想学汉语？”',
        pinyin:
          'Māma xiào le: “Nǐmen xiǎng mǎi shuǐguǒ, háishi xiǎng xué Hànyǔ?”',
        en: 'Mom laughed, “Do you want to buy fruit or study Chinese?”',
      },
      {
        zh: '我们说：“都想！”',
        pinyin: 'Wǒmen shuō: “Dōu xiǎng!”',
        en: 'We said, “Both!”',
      },
      {
        zh: '我们买了苹果和香蕉。',
        pinyin: 'Wǒmen mǎi le píngguǒ hé xiāngjiāo.',
        en: 'We bought apples and bananas.',
      },
    ],
  },
];
