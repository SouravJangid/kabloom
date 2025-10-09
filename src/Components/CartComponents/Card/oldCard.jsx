<Form
                        onSubmit={onSubmit}
                        render={({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                            active
                        }) => {
                            return (
                                <form style={{ marginTop: "10px" }} onSubmit={handleSubmit} className="container  px-0">
                                    <div className="bread-crumb mb-4" onClick={() => this.setState({ addCard: false })}><KeyboardBackspaceIcon style={{fontSize:13, marginRight:10}} /> Back Button</div>
                                    <div className="block-title d-flex justify-content-between align-items-center mb-4">ADD NEW CARD</div>
                                   <div className="mt-4 mb-5" style={{  display:'inline-flex' }}>
                                            <CardChild
                                                number={values.number || ''}
                                                name={values.name || ''}
                                                expiry={values.expiry || ''}
                                                cvc={values.cvc || ''}
                                                focused={active}
                                            />
                                   </div>
                                    <ReactStrapFrom >
                                        <div className="d-flex mt-4">
                                            <div style={{ width: '50%', marginRight: 50}}>
                                                <Field  name="number" component={TextInputField} placeholder="CARD NUMBER" pattern="[\d| ]{16,22}" 
                                                autoFocus={false} type='text' format={formatCreditCardNumber} />
                                            </div>
                                            <div style={{ width: '50%'}}>
                                                <Field  name="name" component={TextInputField} placeholder="NAME"
                                                autoFocus={false} type='text' />
                                            </div>
                                        </div>

                                        <div className="d-flex mt-4">
                                            <div style={{ width: '50%', marginRight: 50}}>
                                                <Field  name="expiry" component={TextInputField} placeholder="EXPIRATION DATE" pattern="\d\d/\d\d" 
                                                autoFocus={false} type='text' format={formatExpirationDate} />
                                            </div>
                                            <div style={{ width: '50%'}}>
                                                <Field  name="cvc" component={TextInputField} placeholder="SECURITY CODE" pattern="\d{3,4}"
                                                autoFocus={false} type='text' format={formatCVC} />
                                            </div>
                                        </div>
                                        
                                    </ReactStrapFrom>

                                    <div className="text-left mt-4" >
                                        <Button variant="contained" disabled={submitting} color="primary" className="bottomActionbutton cartActionBtn" type="submit">
                                            <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> Save and Continue
                                        </Button>
                                    </div> 
                                </form>
                            )
                        }}
                    /> 