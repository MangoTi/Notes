elementUI大部分和iview差不多，只不过标签使用el-开头的方式，以下关注一些特殊的地方。

## 1、el-checkbox-group可以控制选中个数
最少、最多多少个，这个在有些时候很好用了

## 2、el-checkbox-button（checkbox的button形式）
iview只有radio有这种方式，用radio-group的type=button做到

## 3、el-input-number带精度没有bug
iview中的数字输入框带pecision（精度）属性时，每输入一个数字就会自动加上小数点，非常不方便，算是一个bug，而这个不会，是在光标离开后才进行格式化的。

## 4、el-select可以将选中值合并成一段文字
使用属性collapse-tags，很有用，多选的时候样式好看很多

## 5、el-select可以创建条目
使用属性allow-create，选择框可以输入，回车即可创建

## 6、el-date-picker可以选择日、周、年、多个日期
使用属性type
