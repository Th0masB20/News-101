
export function CircularLinkedList(value = null){
    this.nodeValue = value;
    this.next = this;
    this.back = this;

    this.addNext = (value) =>
    {
        if(!this.nodeValue)
        {
            this.nodeValue = value;
        }
        else if(value != null)
        {
            let node = new CircularLinkedList(value)
            node.next = this.back.next;
            this.back.next = node;
            this.back = this.back.next;
        }
    }
}