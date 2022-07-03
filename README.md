# tisp

TypeScript による適当な Lisp 処理系の実装

## 構文

- let _name_ expr  
  現在のスコープに変数を宣言します。  
  expr を評価して、結果を*name*に束縛します。

- set! _name_ expr  
  変数の値を上書きします。  
  expr を評価して、結果を*name*に束縛します。

- local expr ...  
  新しいローカル変数のスコープを作り出します。  
  expr を順に評価して最後の値を返します。

```
(local
  (let a 1)
  (+ a 2)) ; ok
(+ a 2) ; error
```

- if test consequent alternative  
   if test consequent  
  test を評価し、その結果が真なら consequent を評価します。真以外であれば alternative を評価します。  
  alternative を省略した場合は nil を返します。

- or epxr ...
  expr を評価し、最初に現れた真の値を返します。  
  全て真以外なら、最後に評価した値を返します。

- and
  expr を評価し、最初に現れた真以外の値を返します。  
  全て真なら、最後に評価した値を返します。

- fun (_param_ ...) expr ...  
  手続きを生成します。

- begin expr ...  
  現在の文脈で expr を順に評価し、最後の結果を返します。

## 関数

- \+ _number_ ...  
  足し算

- \- _number_ _number_ ...  
  引き算

- \* _number_ ...  
  掛け算

- \/ _number_ _number_ ...  
  割り算

- remainder _number_ _number_  
  余りを返す

- zero? _number_  
  ゼロか？

- abs _number_  
  絶対値を返す
