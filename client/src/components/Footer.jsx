import { Footer, FooterTitle } from "flowbite-react"
import { Link } from "react-router-dom"
import {BsFacebook, BsInstagram, BsGithub, BsLinkedin} from 'react-icons/bs';


export default function FooterCom(){
    return(
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className=" grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                    <Link to ="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'> 
                         {/* className is created so that when we change the screen resolution it will automatically adjust to the size and whitespace-nowrap 
                         is used so that both udays ad blog will be only in one line and text.xl it will auto adjust its size & when mode is black turn text into white */}
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Udaya's</span> 
                        Blog  
                        {/* both Udaya's and Blog will be side by side 
                        1) px-2 :padding around x axis and py-1 : padding around y axis
                        2)bg-radient-to-r :from right onwards the colour is radient
                        3) movement of colour from indigo, purple and pink
                        4)rounded-lg : rounding the borders of the block
                        5) text-white :whatsoever mode is it in just make the text colour white */}
                    </Link>
                    </div>
                    <div className="grid grid-col-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div> {/*added div so that both will be on top of eachother */}
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href=" " target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                100 js projects
                            </Footer.Link>

                            <Footer.Link href="/about " target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                Udaya's Blog
                            </Footer.Link>

                            <Footer.Link href=" /Dashboard" target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                DashBoard
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>


                        <div> {/*added div so that both will be on top of eachother */}
                        <Footer.Title title='Follow Us'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="https://github.com/Udayasree-Banothu444 " target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                GitHub
                            </Footer.Link>

                            <Footer.Link href="https://www.instagram.com/__udaya_banoth__/ " target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                Instagram
                            </Footer.Link>

                            <Footer.Link href=" https://www.linkedin.com/in/banothu-udayasree-609156229/" target="_blank" rel="noopener noreferrer"> {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                               Linkedin
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>


                        <div> {/*added div so that both will be on top of eachother */}
                        <Footer.Title title='Legal'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href="#"  > {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                Privacy Policy
                            </Footer.Link>

                            <Footer.Link href="# " > {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                                Terms & Conditions
                            </Footer.Link>

                            <Footer.Link href=" #" > {/*noopener norefferrer will be blocking all the unnesessary ads when we open the linked website*/}
                              hshdhsjds
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                    </div>
                </div>



                <Footer.Divider/>
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href='#' by ="Udaya's Blog" year={new Date().getFullYear()}/>
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='https://www.instagram.com/__udaya_banoth__/' icon={BsInstagram} />
                        <Footer.Icon href='https://github.com/Udayasree-Banothu444' icon={BsGithub} />
                        <Footer.Icon href='https://www.linkedin.com/in/banothu-udayasree-609156229/' icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        
        
        
        
        
        </Footer>
    )
}