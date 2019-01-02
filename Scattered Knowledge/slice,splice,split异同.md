# slice
用法array.slice(start,end)，string.slice(start,end)用来截取部分内容，可以作用数组和字符串，返回副本，不修改原数据，截取内容不包括end下标的字符或数组项，若只传一个参数（正数），就是从该下标截取直到最后，负数就是从后往前截取，同样用来字符串截取的还有以下几个：  
1、substring  
用法str.substring(indexStart, [indexEnd])，同样不包括end下标的内容，若只传一个数字，用法也与slice相同，同样也不修改原数据，不同的是substring会以小的数字为起点，大的为结尾，slice不行，并且substring不支持负数，会都视为0；  
2、substr  
用法str.substr(start, [length])，不同于前两者的是，第二个参数是要截取的长度，若只传一个数字，用法也与slice相同，但是长度小于0或者等于0，返回空；

# splice
用法array.splice(start,deleteCount,item...)只能用于数组删除、新增内容，会修改原来的数组，从array中移除一个或多个数据，并用新的item替换它们，item若有多个，会按照参数中的数序一起放在插入位置，若item不传，就是删除，若删除数量为0，就是直接插入。

#split
用法string.split(separator,limit)，把这个string分割成片段来创建一个字符串数组。可选参数limit可以限制被分割的片段数量。separator参数可以是一个字符串或一个正则表达式，separator是一个空字符，会返回一个单字符的数组。a.split("")可以直接将一个字符串转成数组，每个字符单独为一项。
例如 ： 

        str = “s-aaa-sss-eee-www”;
        targetArr = str.slite(“-”);    //[‘s’,’aaa’,’sss’,’eee’,’www’]
        
