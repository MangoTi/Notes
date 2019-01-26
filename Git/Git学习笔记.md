# 引言
Git是目前世界上最先进的分布式版本控制系统，而svn等是集中式的，有一台中央服务器，必须联网才能工作，相当于是从中央服务器拉取代码，改完再上传到中央服务器。而分布式没有所谓的中央服务器，每个人的电脑上都是完整的版本库，发生改变时只需将各自修改的版本推送给对方，为了便于交换代码，也会有一台中间服务器，只是为了交换更加方便，就算没有也不影响工作，只是交换变得麻烦。

# 使用
## 创建版本库
**1、安装完成后，可使用以下命令指定你的这台机器的名称和邮箱**

	$ git config --global user.name "Your Name"
	$ git config --global user.email "email@example.com"
	
**2、创建并添加文件再上传**
选择一个位置，可以是空的文件夹，也可以非空，右键bash here，使用git init命令，就会在当前位置创建一个版本库，会生成一个.git的目录，是Git用来跟踪管理版本库的。  
所有的版本控制系统都只能跟踪文本文件的改动，图片、视频这些二进制编码的文件是无法跟踪的，Microsoft的Word格式也是二进制格式。  
创建文件时主要不要用windows自带的记事本编辑文本，因为其文件开头添加了十六进制字符，会出现很多问题，所以建议所有文件都用UTF-8编码。  
使用$ git add readme.txt将文件放入到仓库中，然后可以使用$ git commit -m "wrote a readme file"将文件提交，git commit可以提交多个文件。

## 时光穿梭
**1、修改并提交**
运行git status命令可以查看仓库当前状态，修改了还未提交也会有记录，还可以用git diff来做版本比较，提交也是先git add再git commit。

**2、版本回退**
用git log查看提交的版本信息，用$ git reset --hard HEAD^回到上个版本，上上个版本就是HEAD^^，也可以写成HEAD~100，如果已经回到上个版本，原本的版本就不在了log里了，但是要是还能看到原本的版本号，只要$ git reset --hard 1092a，只用写前几个数字，会自己查找，但是只写前1 2位，可能就找不到唯一的。如果是关机之后还想看命令行，可以用git relog便于查到之前的id

**3、工作区和暂存区**
* 工作区就是本地的内容文件夹；
* 版本库，工作区的.git文件夹，其中主要是stage（暂存区），以及git为我们自动创建的第一个分支master，以及指向master的指针head，把文件往git版本库中添加的时候，首先是用git add添加到暂存区，然后用git commit提交更改，就是把暂存区的内容提交到当前分支。

**4、撤销修改**
git checkout --<file>可以将工作区的修改撤销，回到最近一次git commit或者git add的状态，即恢复到版本区的内容；  
git reset HEAD <file>可以将暂存区的修改撤销。

**5、删除文件**
如果在文件管理器中将文件删除了，或者用$rm <file>删除了文件，如果确实要将内容删除，使用$git rm删除并且git commit;
但是如果是删错了，可以使用git checkout --<file>恢复。

## 远程仓库
GitHub是仓库托管网站，注册账号就可以获取免费的Git远程仓库，由于本地Git和远程仓库间的传输是通过SSH加密的，因此要设置SSH密钥：
* 1、创建SSH Key：在本地git bash然后$ ssh-keygen -t rsa -C "youremail@example.com"就会在用户主目录中生成一个.ssh目录，里面有id_rsa和id_rsa.pub两个文件，这两个就是SSH Key的秘钥对，id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人；  
* 2、登录GitHub，打开账户设置，添加SSH Key，填上任意的title，在Key文本框里粘贴id_rsa.pub文件的内容；
GitHub允许添加多个Key

**1、添加远程库**
在GitHub上创建远程仓库之后，如果要跟本地已有的Git项目关联起来，使用命令$ git remote add origin git@github.com:michaelliao/learngit.git
origin是远程库的名称，是默认的叫法，然后可以将本地的内容推送到远程库$ git push -u origin master，实际上是将当前分支master推送到远程，-u是将本地的mater分支跟远程的master分支也关联了起来，后续就可以简化命令，接下来如果本地做了提交就可以通过git push origin master将内容推送到远程库。
PS:第一次使用SSH连接会有警告，确认信息是否真的来自GitHub，输入yes回车即可。

**2、从远程库克隆**
如果是先有的远程库，可以将内容克隆到本地，使用$ git clone git@github.com:michaelliao/gitskills.git
