---
title: "FTP File Operations on Apache Commons Net Library in Java"
description: ""
tags:
  - programming
  - java
date: 2013-08-18T11:33:00.000Z
updateDate: 2013-08-18T11:33:00.000Z
external: false
---

The main idea was ‘keep it simple’. Apache Commons Net Library also has functions to file operations. But `FTPFileOperations` class usage is easy. The class have copy directory, and list files of specific directory which they are not in Apache Commons Net Library.

Firstly, `baglantiAc` function is to open an FTP connection and to enter the FTP directory with specific username and password. This function takes three arguments. First argument is address of server, second is username and the last one is password of user. baglantiAc function is public and calls `sunucuyaBaglan` and `kullaniciGirisi` functions. This function also checks the connection after connected to server.

`sunucuyaBaglan` function takes one argument which is address of server. If an error occurs when connecting to server, the exception will throw.

`kullaniciGirisi` function takes two arguments which are username and password. This function provides login to server with a username and password. The function also checks the connection is already exist and robust.

Secondly, `baglantiKapat` function is to close an FTP connection. This function calls two functions. One of them is `kullaniciCikisi` and the other is `sunucuylaBaglantiyiKes`.
`kullaniciCikisi` function takes no argument. The function is used for logout from current user.

`sunucuylaBaglantiyiKes` function takes no argument. The function is used for close the connection. If an error occurs when closing connection, appropriate exceptions will be throwing.
Projects main functions are file operation functions which they are `dosyaYukle`, `dosyaIndir`, `dizinKopyala`, `dosyaVeyaDizinSil`, `dosyalariListele`.

`dosyaYukle` function is to use upload a file to given directory on the FTP server. If the address is not exist, the function creates this directory on FTP server. If the directory exists on the FTP server directory, the files are just putted in there. Files which they wanted to upload must be named and list of names must give as parameter to function. This function has Boolean return type. If the process is done successfully, function will return true.

`dizinKopyala` function is copy a directory from given address to other directory which is given as parameters. Copy process is processing on FTP server. Source and destination addresses are absolutely on FTP server. The function not copies a directory from computer to FTP server or reverse. `dizinKopyala` function is working very simple. The function downloads the directory to computer, and uploads this directory the given destination. When this process is done successfully, the function deletes the directory on the computer. To download a directory from FTP server, the function use `dosyaIndir` function. To upload a directory to FTP server, the function use `dosyaYukle` function. To delete a directory on the computer, the function use `dosyaVeyaDizinSil` function. At the end of function, the function checks the directories copied successfully or not. If the process is done successfully, function will return true.

`dosyaVeyaDizinSil` function is deletes a directory or a file from given address. Apache Commons Net library has removeDirectory and `deleteFile` functions. But `removeDirectory` function is not deletes a directory which include files or directories. `dosyaVeyaDizinSil` function provides a directory which includes directories, and files. In the function, Apache Commons Net functions are used. Firstly, function goes into the directory innermost and deletes all files. After that function goes to parent directory and deletes the directory which is empty. In this working logic, directories can delete successfully. If the process is done successfully, function will return true.

`dosyalariListele` function is listing files on current directory. The function returns a list of string. This list contains names of files on current directory. To compose this list, function gets the file and takes the name and adds to the list.

There are some assistant functions. `sunucuyaBaglan`, `sunucuylaBaglantiyiKes`, `kullaniciGirisi`, `kullaniciCikisi`, `baglantiyiKontrolEt` functions are assistant functions. I mentioned them before except baglantiyiKontrolEt.

`baglantiyiKontrolEt` function takes no argument and returns boolean value. This function checks the connection is still working and robust. If the connection is broken, this function calls `sunucuylaBaglantiyiKes` function and returns false. So system will stop.

Here is the source code and comments are also added in Turkish.

```java
 import java.io.File;
 import java.io.FileInputStream;
 import java.io.FileNotFoundException;
 import java.io.FileOutputStream;
 import java.io.IOException;
 import java.io.OutputStream;
 import java.net.SocketException;
 import java.util.ArrayList;
 import java.util.List;
 import org.apache.commons.net.ftp.FTPClient;
 import org.apache.commons.net.ftp.FTPClientConfig;
 import org.apache.commons.net.ftp.FTPFile;
 import org.apache.commons.net.ftp.FTPReply;
 /**
  * FTP sunucudan dosya indiren, sunucuya dosya yukleyen, sunucudaki dosyalari kopyalayan,
  * sunucudaki dosyalari listeleyebilen ve silen siniftir.
  *
  * @author Candost Dağdeviren
  * */
 public class FTPDosyaIslemleri {
  private FTPClient ftp = new FTPClient();
  private String olusacakKlasor="FTPDOSYAISLEMLERI";
  private String adres="C:\\Documents and Settings\\candost\\Desktop";
  /**
  * Projenin bulundugu dizinde null adında bir klasor olusturuyor.
  * Bu null adli klasorun linki buraya set edilmelidir.
  * */
  private String geciciAdres = "C:\\Documents and Settings\\candost\\workspace\\ftpd\\null";
  /**
  * ORNEK KULLANIM:
  * baglantiAc("127.0.0.1", "candost", "12345");
  * dosyaIndir(dosyaListesi);
  * dosyaSil("deneme1");
  * dosyaYukle(dosyaListesi, "deneme1"+File.separator+"denemeAlt");
  * dizinKopyala("C:\\Documents and Settings\\candost\\Desktop\\deneme", "C:\\Documents and Settings\\candost\\workspace");
  * baglantiyiKapat();
  */
  /**
  * Degiskenlerin baslangic degerlerini ayarlayan yapici fonksiyondur.
  * */
  FTPDosyaIslemleri(){
  setKaynakAdres("C:\\Documents and Settings\\candost\\Desktop");
  setOlusacakKlasor("deneme");
  }
  /**
  * Sunucu uzerinden dosya indirebilen fonksiyondur. Indirilen dosyalar proje klasorunun icerisine indirilir.
  * Olusturulmasi istenilen klasor ismi <code>setOlusacakKlasor(<code>String</code>)</code> fonksiyonu
  * ile belirlenmelidir.
  * @param dosyaListe indirilmesi istenilen dosyalarin listesidir.
  * @return boolean indirip indirilmedigini <code>boolean</code> olarak döndürür.
  * */
  @SuppressWarnings("resource")
  public boolean dosyaIndir(List<String> dosyaListe) {
  int kontrol = 0;
  for (int i = 0; i < dosyaListe.size(); i++) {
   new File("."+File.separator+getOlusacakKlasor()).mkdir(); //olusturulmasi istenilen klasor olusturulur.
   File dosya = new File("."+File.separator+getOlusacakKlasor()+File.separator+dosyaListe.get(i)); //Indirilecek dosya alınır.
   if (dosya.exists()) { //Eğer dosya zaten varsa, dosya indirme başarısız olur.
   return false;
   }
   OutputStream indirilenDosya;
   try {
   indirilenDosya = new FileOutputStream(dosya);
   if(!baglantiyiKontrolEt()){
    return false;     //FTP bağlantısı kontrol edilir.
   }
   ftp.retrieveFile(dosyaListe.get(i), indirilenDosya); //Bağlantı varsa indirilen dosya, belirlenen klasore yazilir.
   indirilenDosya.close();
   } catch (FileNotFoundException e) {
   e.printStackTrace();
   } catch (IOException e) {
   e.printStackTrace();
   }
   kontrol++;
  }
  return (kontrol == dosyaListe.size()) ? true : false;  //Bütün dosyalarin indirilip indirilmedigi kontrol edilir.
  }
  /**
  * Sunucuya dosya yukleyen fonksiyondur.
  * @param dosyaListesi yuklenilmesi istenilen dosyalarin listesidir
  * @param sunucuDizini dosyalarin sunucu uzerinde hangi dizine yuklenecegidir.
  * @return yuklemenin basarili olup olmamasını dondurur. Basariliysa <code>true</code>, basarisizsa <code>false</code> dondurur.
  * */
  public boolean dosyaYukle(List<String> dosyaListesi, String sunucuDizini){
  if(getKaynakAdres()==null){
   return false;
  }
  FileInputStream yuklenecekDosya;
  int i=0;      //Alt dizin sayısını bulmak için.
  try {
   if(!ftp.changeWorkingDirectory(sunucuDizini)){ //istenilen dizine geçiş yapılamazsa. Yani dizin bulunmuyorsa.
   if(sunucuDizini.contains(File.separator)){ //istenilen dizinin içerisinde separator varsa yani alt dizinlere sahipse
    String[] dizinSayi = sunucuDizini.split(File.separator+File.separator); //Verilen dizinin alt dizinlerine ulaşmak için bölüyoruz.
    for(i=0;i<dizinSayi.length;i++){  //Bu bölümün amacı kaç tane alt dizine sahip olduğunu bulmaktır.
    if(ftp.printWorkingDirectory().equals(sunucuDizini.substring(0,sunucuDizini.lastIndexOf(File.separator)-i)))
     break;
    }
    i--;    //Fazladan for döngüsünün son kontrolünde eklediği 1'i çıkarıyoruz.
    for(int j=0;i>=0;i--,j++){ //Alt dizinler için tek tek ağaç şeklinde dizin yaratıyoruz.
    if(!ftp.changeWorkingDirectory(ftp.printWorkingDirectory()+File.separator+dizinSayi[j])){
     ftp.makeDirectory(dizinSayi[j]);
     ftp.changeWorkingDirectory(ftp.printWorkingDirectory()+File.separator+dizinSayi[j]);
    }
    }
    for(i=0; i<dosyaListesi.size();i++){ //Oluşturduğumuz dizinin içerisine yüklemek istediğimiz dosyaları yüklüyoruz.
    try {
     yuklenecekDosya = new FileInputStream(getKaynakAdres()+File.separator+dosyaListesi.get(i));
     ftp.storeFile(dosyaListesi.get(i), yuklenecekDosya);
     yuklenecekDosya.close();
    } catch (FileNotFoundException e) {
     e.printStackTrace();
    }
    }
   }
   else {       //Oluşturulması istenilen dizin alt dizinlere sahip değilse. Yani sadece 1 dizinse
    ftp.makeDirectory(sunucuDizini);   //Bulunulan dizine direkt olarak istenilen dizini ekliyoruz.
    if(ftp.changeWorkingDirectory(sunucuDizini)){ //Eklediğimiz dizine geçiyoruz.
    for(i=0; i<dosyaListesi.size();i++){ //Oluşturduğumuz dizine dosyaları yüklüyoruz.
     try {
     yuklenecekDosya = new FileInputStream(getKaynakAdres()+File.separator+dosyaListesi.get(i));
     ftp.storeFile(dosyaListesi.get(i), yuklenecekDosya);
     yuklenecekDosya.close();
     } catch (FileNotFoundException e) {
     e.printStackTrace();
     }
    }
    }
    else{
    throw new IOException("Girdiğiniz dizin geçerli değil");
    }
   }
   }
   else{      //İstenilen dizine direkt geçiş yapabilirse
   for(i=0; i<dosyaListesi.size();i++){ //İstenilen dizine geçiş yaptığımız için direkt olarak dosyaları yüklüyoruz.
    try {
    yuklenecekDosya = new FileInputStream(getKaynakAdres()+File.separator+dosyaListesi.get(i));
    ftp.storeFile(dosyaListesi.get(i), yuklenecekDosya);
    yuklenecekDosya.close();
    } catch (FileNotFoundException e) {
    e.printStackTrace();
    }
   }
   }
   if(ftp.changeWorkingDirectory(sunucuDizini)){  //Butun dosyalarin yuklenip yuklenmedigi kontrol edilir.
   List<String> dosyalar = dosyalariListele();
   return dosyalar.equals(dosyaListesi) ? true : false;
   }
  } catch (IOException e1) {
   e1.printStackTrace();
  }
  return false;
  }
  /**
  * Sunucu uzerindeki bir dizini baska bir dizine kopyalayan fonksiyondur
  * @param dizindenKopyala kopyalanmasi istenen dizin.
  * @param dizineKopyala kopyalanacak olan dizinin nereye kopyalanacagi bilgisi.
  * @return kopyalama islemi basarili olursa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * */
  public boolean dizinKopyala(String dizindenKopyala, String dizineKopyala){
  try {
   if(ftp.changeWorkingDirectory(dizindenKopyala)){ //Dizin degistirilirse kopyalama islemi baslayabilir.
   String[] anlikDizin = dizindenKopyala.split(File.separator+File.separator); //Kopyalanacak Klasörün ismini almak için kullanılır.
   dosyaIndir(dosyalariListele());   //Kopyalanacak dizinin icerisindeki dosyalari indirir.
   ftp.changeWorkingDirectory(getGeciciAdres()); //Dosyalari tutmak icin gecici bir dizin olustururlur.
   List<String> dosyalar = dosyalariListele();  //Gecici dizindeki dosyalarin listesi alinir.
   ftp.changeWorkingDirectory(dizineKopyala);  //Kopyalanacak olan dizinin kopyalanacagi dizine gecilir.
   ftp.makeDirectory(anlikDizin[anlikDizin.length-1]); //Kopyalanacak olan dizin icin ayni isimde dizin olusturulur.
   ftp.changeWorkingDirectory(dizineKopyala+File.separator+anlikDizin[anlikDizin.length-1]); //Olusturulan dizine gecilir.
   FileInputStream fis;
   for(int i=0;i<dosyalar.size();i++){   //Dosyalar tek tek yeni olusturulan dizine eklenir.
    fis = new FileInputStream(dizindenKopyala+File.separator+dosyalar.get(i));
    ftp.storeFile(dosyalar.get(i), fis);
   }
   dosyaVeyaDizinSil(getGeciciAdres());    //Gecici dizin silinir.
   if(ftp.changeWorkingDirectory(dizineKopyala+File.separator+anlikDizin[anlikDizin.length-1])){ //Kopyalanmis dizine gecilir.
    List<String> kopyalanmisDosyalar = dosyalariListele();     //Kopyalanmis dizindeki dosyalarin listesi alinir.
    return kopyalanmisDosyalar.equals(dosyalar) ? true : false; //Eger ilk liste ile ayni ise islem basarilidir. Degilse basarisizdir.
   }
   }
   else    //Dizin degistirilemezse dizini bulamamis demektir.
   return false;
  } catch (IOException e) {
   e.printStackTrace();
  }
  return false;
  }
  /**
  * Silinmesi istenilen dosyanin veya dizinin silinmesini saglayan fonksiyondur.
  * @param silinecekDizin silinmesi istenilen dosyanın veya dizinin tam adres bilgisi parametresi
  * @return boolean islem basarili olursa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * @throws FileNotFoundException silinmesi istenilen dosya veya dizin bulunamazsa
  * */
  public boolean dosyaVeyaDizinSil(String silinecekDizin) throws FileNotFoundException{
  try {
   if(!ftp.changeWorkingDirectory(silinecekDizin)){ //dizin değiştirilemezse yani silinecek olan bir dosya ise
   if(silinecekDizin.contains(File.separator)){  //dosyaya gelene kadar olan kısımda separator var mı
    ftp.changeWorkingDirectory(silinecekDizin.substring(0,silinecekDizin.lastIndexOf(File.separator))); //dosyanın olduğu directory ye geliyoruz
    if(!ftp.deleteFile(silinecekDizin.substring(silinecekDizin.lastIndexOf(File.separator)+1))){ //dosyayı silemezse dosya yoktur
    throw new FileNotFoundException();
    }
    else
    return true;
   }
   else {
    ftp.deleteFile(silinecekDizin);   //Eger ana dizinden bir dosya silinecekse
    return true;
   }
   }
   else{
   FTPFile[] ftpDosyalari = ftp.listFiles();
   for(FTPFile dosya : ftpDosyalari){
    if(dosya.isFile()){    //dizin değiştirilebildiyse ve o dizindeki bir dosya silinecekse
    ftp.deleteFile(dosya.getName());
    }
    else if(dosya.isDirectory()){   //dizin değiştirilebildiyse ve o dizindeki bir klasörse
    if(ftp.removeDirectory(dosya.getName())){} // eğer klasör boşsa silsin
    else {
     dosyaVeyaDizinSil(dosya.getName());   //değilse klasörün içine geçmek için recursion kullansın ve içeriğini silsin.
    }
    }
   }
   }
   ftp.changeToParentDirectory(); //ağaç şeklinde olan dosyalarda çıkarken klasörün de silinmesi isteniyorsa o klasörün bir üst directorysine gidilir.
   if(silinecekDizin.matches(".*\\.*")){  //eğer elimizdeki adres separator içeriyorsa bölünür. yani klasör alt dizinlerden birindeyse
   ftp.removeDirectory(silinecekDizin.substring(silinecekDizin.lastIndexOf(File.separator)+1)); //silinmek istenilen directory silinir
   }
   else{
   ftp.removeDirectory(silinecekDizin);  //eğer separator yoksa direkt silinir. yani klasör ana dizindeyse
   }
   if(ftp.changeWorkingDirectory(silinecekDizin)){ //Dizinin silinip silinmedigi kontrol edilir.
   return false;
   }
   else
   return true;
  } catch (IOException e) {
   e.printStackTrace();
  }
  return false;
  }
  /**
  * O anki bulunulan dizindeki dosyalari listeleyen fonksiyondur
  * @return <code>List<String></code> dosyalarin listesini tutan <code>String</code> <code>List</code> dondurur.
  * */
  public List<String> dosyalariListele() {
  int i = 0;
  List<String> dosyaListesi = new ArrayList<String>(); //Dosyalarin isimlerinin tutulacagi degisken.
  List<FTPFile> ftpDosyalari = new ArrayList<FTPFile>(); //Dosyalarin tutulacagi liste
  try {
   FTPFile[] ftpdosyalari = ftp.listFiles();  //Dosyalar tek tek dosya listesine alinir.
   for(int j=0; j<ftpdosyalari.length; j++){
   ftpDosyalari.add(j,ftpdosyalari[j]);
   }
  } catch (IOException e) {
   e.printStackTrace();
  }
  for (FTPFile ftpDosya : ftpDosyalari) {   //Dosyalarin isimleri tek tek dosya isim listesine eklenir.
   if (ftpDosya.getType() == FTPFile.FILE_TYPE) {  //Burada, dosya olarak alinanlarin gercekten dosya olup olmadigina bakilir.
   dosyaListesi.add(i, ftpDosya.getName());
   i++;
   }
  }
  return dosyaListesi;
  }
  /**
  * FTP baglantisinin acilmasini saglayan fonksiyondur
  * @param sunucuAdresi baglanilmasi istenilen sunucunun <code>String</code> olarak adres bilgisi
  * @param kullanici sunucuya baglanacak olan <code>String</code> olarak kullanici adi bilgisi
  * @param sifre sunucuya baglanacak olan kullanicinin <code>String</code> olarak sifre bilgisi
  * @return boolean baglanti basarili olarak acilirsa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * */
  public boolean baglantiAc(String sunucuAdresi, String kullanici, String sifre) {
  FTPClientConfig config = new FTPClientConfig();
     config.setLenientFutureDates(true);
     ftp.configure(config );
  return (sunucuyaBaglan(sunucuAdresi) && baglantiyiKontrolEt() && kullaniciGirisi(kullanici, sifre)) ? true : false;
  }
  /**
  * FTP baglantisinin sonlanmasini saglayan fonksiyondur.
  * @return boolean baglanti basarili olarak kapatilirsa true, basarisiz olursa false dondurur.
  * */
  public boolean baglantiyiKapat() {
  return (kullaniciCikisi() && sunucuylaBaglantiyiKes()) ? true : false;
  }
  /**
  * FTP sunucusuna baglanmayi saglayan fonksiyondur
  * @param sunucuAdd sunucu adresini tutan <code>String</code> degiskenidir
  * @return boolean sunucuya baglanti basarili olursa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * */
  private boolean sunucuyaBaglan(String sunucuAdd) {
  try {
   ftp.connect(sunucuAdd);
   return true;
  } catch (SocketException e) {
   e.printStackTrace();
  } catch (IOException e) {
   e.printStackTrace();
  }
  return baglantiyiKontrolEt() ? true : false;
  }
  /**
  * FTP sunucusuna kullanici girisi yapilmasini saglayan fonksiyondur.
  * @param kullaniciAdi kullanicinin adi bilgisini tutan <code>String</code> degiskenidir.
  * @param sifre kullanicinin sifre bilgisini tutan <code>String</code> degiskenidir.
  * @return boolean kullanici girisi basarili olursa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * */
  private boolean kullaniciGirisi(String kullaniciAdi, String sifre) {
  try {
   ftp.login(kullaniciAdi, sifre);
   baglantiyiKontrolEt();
   return true;
  } catch (IOException e) {
   e.printStackTrace();
  }
  return false;
  }
  /**
  * FTP sunucusuna baglanmis olan mevcut kullanicinin sunucudan cikis yapmasini saglayan fonksiyondur.
  * @return boolean eger kullanici cikisi basarili olursa <code>true</code>, basarisiz olursa <code>false</code> dondurur.
  * */
  private boolean kullaniciCikisi() {
  try {
   ftp.logout();
   return true;
  } catch (IOException e) {
   e.printStackTrace();
  }
  return false;
  }
  /**
  * Kurulmus olan FTP baglantisinin hala gecerli olup olmadiginin kontrolunu saglayan fonksiyondur.
  * @return boolean eger baglanti hala gecerliyse <code>true</code>, gecerli degilse <code>false</code> dondurur.
  * */
  private boolean baglantiyiKontrolEt() {
  int reply = ftp.getReplyCode();
  if (!FTPReply.isPositiveCompletion(reply)) {
   sunucuylaBaglantiyiKes();
   return false;
  }
  return true;
  }
  /**
  * FTP sunucusuyla olan baglantinin kesilmesini saglayan fonksiyondur
  * @return boolean eger baglanti basarili bir sekilde kesilirse <code>true</code>, kesilmezse <code>false</code> dondurur.
  * */
  private boolean sunucuylaBaglantiyiKes() {
  try {
   ftp.disconnect();
   return true;
  } catch (IOException e) {
   e.printStackTrace();
  }
  return false;
  }
  public String getOlusacakKlasor() {
  return olusacakKlasor;
  }
  public void setOlusacakKlasor(String olusacakKlasor) {
  this.olusacakKlasor = olusacakKlasor;
  }
  public void setKaynakAdres(String kaynakAdres){
  this.adres = kaynakAdres;
  }
  public String getKaynakAdres(){
  return adres;
  }
  public String getGeciciAdres() {
  return geciciAdres;
  }
  public void setGeciciAdres(String geciciAdres) {
  this.geciciAdres = geciciAdres;
  }
 }
```
